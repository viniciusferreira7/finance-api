import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'
import { FetchUserCategoriesHistoryUseCase } from './fetch-user-categories-history'

let categoriesRepository: CategoriesRepository
let usersRepository: UsersRepository
let sut: FetchUserCategoriesHistoryUseCase

describe('Fetch user categories history use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserCategoriesHistoryUseCase(
      categoriesRepository,
      usersRepository,
    )
  })

  it('should be able to fetch user history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 2; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        icon_name: 'arrow-right',
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      page: 1,
      per_page: 10,
    })

    expect(results).toHaveLength(2)
    expect(results).toEqual([
      expect.objectContaining({ name: `category-1` }),
      expect.objectContaining({ name: 'category-2' }),
    ])
  })

  it('should not be able to fetch history without a user', async () => {
    for (let i = 1; i <= 22; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        icon_name: 'arrow-right',
        user_id: 'non-existing-id',
      })
    }

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        page: 3,
        per_page: 10,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to fetch paginated history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 22; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        icon_name: 'arrow-right',
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      page: 3,
      per_page: 10,
    })

    expect(results).toHaveLength(2)
    expect(results).toEqual([
      expect.objectContaining({ name: `category-21` }),
      expect.objectContaining({ name: 'category-22' }),
    ])
  })

  it('should be able to fetch without pagination history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 22; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        icon_name: 'arrow-right',
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      pagination_disabled: true,
    })

    expect(results).toHaveLength(22)
  })
})

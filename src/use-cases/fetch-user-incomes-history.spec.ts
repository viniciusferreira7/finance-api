import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryIncomesRepository } from '@/repositories/in-memory/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'
import { FetchUserIncomesHistoryUseCase } from './fetch-user-incomes-history'

let incomesRepository: IncomesRepository
let usersRepository: UsersRepository
let sut: FetchUserIncomesHistoryUseCase

describe('Fetch user incomes history use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserIncomesHistoryUseCase(incomesRepository, usersRepository)
  })

  it('should be able to fetch user history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 2; i++) {
      await incomesRepository.create({
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
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
      expect.objectContaining({ category_id: 'category-1' }),
      expect.objectContaining({ category_id: 'category-2' }),
    ])
  })

  it('should not be able to fetch history without a user', async () => {
    for (let i = 1; i <= 22; i++) {
      await incomesRepository.create({
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
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
      await incomesRepository.create({
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
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
      expect.objectContaining({ category_id: 'category-21' }),
      expect.objectContaining({ category_id: 'category-22' }),
    ])
  })

  it('should be able to fetch without pagination history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 22; i++) {
      await incomesRepository.create({
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
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

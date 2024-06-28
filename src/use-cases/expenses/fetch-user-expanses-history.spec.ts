import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { FetchUserExpensesHistoryUseCase } from './fetch-user-expenses-history'

let expensesRepository: InMemoryExpensesRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserExpensesHistoryUseCase

describe('Fetch user expenses history use case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserExpensesHistoryUseCase(
      expensesRepository,
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
      await expensesRepository.create({
        name: 'video game',
        value: 500 + i * 10,
        description: 'Course',
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
      await expensesRepository.create({
        name: 'video game',
        value: 500 + i * 10,
        description: 'Course',
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
      await expensesRepository.create({
        name: 'video game',
        value: 500 + i * 10,
        description: 'Course',
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
      await expensesRepository.create({
        name: 'video game',
        value: 500 + i * 10,
        description: 'Course',
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

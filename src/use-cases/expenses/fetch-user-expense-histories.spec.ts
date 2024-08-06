import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryExpenseHistoriesRepository } from '@/repositories/in-memory/expenses/in-memory-expense-histories-repository'
import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { FetchUserExpenseHistoriesUseCase } from './fetch-user-expense-histories'

let expensesRepository: InMemoryExpensesRepository

let expenseHistoriesRepository: InMemoryExpenseHistoriesRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserExpenseHistoriesUseCase

describe('Fetch user expenses history use case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository()

    expenseHistoriesRepository = new InMemoryExpenseHistoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserExpenseHistoriesUseCase(
      expenseHistoriesRepository,
      expensesRepository,
      usersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch user history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 2; i++) {
      await expenseHistoriesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        expense_id: expense.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      expenseId: expense.id,
      searchParams: {
        page: 1,
        per_page: 10,
      },
    })

    expect(results).toHaveLength(2)
    expect(results).toEqual([
      expect.objectContaining({ category_id: 'category-1' }),
      expect.objectContaining({ category_id: 'category-2' }),
    ])
  })

  it('should not be able to fetch history without a user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await expenseHistoriesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: 'non-existing-id',
        expense_id: expense.id,
      })
    }

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        expenseId: expense.id,
        searchParams: {
          page: 3,
          per_page: 10,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to fetch histories without a expense', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        expenseId: 'no-one-expense-id',
        searchParams: {
          page: 3,
          per_page: 10,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to fetch paginated history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await expenseHistoriesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        expense_id: expense.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      expenseId: expense.id,
      searchParams: {
        page: 3,
        per_page: 10,
      },
    })

    expect(results).toHaveLength(2)
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category_id: 'category-21' }),
        expect.objectContaining({ category_id: 'category-22' }),
      ]),
    )
  })

  it('should be able to fetch without pagination history', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await expenseHistoriesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        expense_id: expense.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      expenseId: expense.id,
      searchParams: {
        pagination_disabled: true,
      },
    })

    expect(results).toHaveLength(22)
  })

  it('should be able to fetch expenses using created at and name and sort from most recent', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 200; i++) {
      const oneDayInMilliseconds = 1000 * 60 * 60 * 24

      vi.advanceTimersByTime(oneDayInMilliseconds)

      const name = faker.helpers.arrayElement([
        'job replace',
        faker.lorem.word(),
        faker.lorem.word(),
      ])

      await expenseHistoriesRepository.create({
        name,
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: new Date(),
        expense_id: expense.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      expenseId: expense.id,
      searchParams: {
        page: 1,
        per_page: 20,
        pagination_disabled: false,
        createdAt: {
          from: '2000-01-01',
          to: '2000-04-29',
        },
        name: 'job',
        sort: 'desc',
      },
    })

    const expenseHistories = results[0]

    const createdAtExpense = dayjs(expenseHistories.created_at).format(
      'YYYY-MM',
    )

    expect(expenseHistories.name).toContain('job')
    expect(createdAtExpense).toBe('2000-04')
  })
})

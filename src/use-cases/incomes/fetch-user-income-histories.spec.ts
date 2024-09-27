import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryIncomeHistoriesRepository } from '@/repositories/in-memory/incomes/in-memory-income-histories-repository'
import { InMemoryIncomesRepository } from '@/repositories/in-memory/incomes/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { FetchUserIncomesHistoriesUseCase } from './fetch-user-income-histories'

let incomesRepository: InMemoryIncomesRepository

let incomeHistoriesRepository: InMemoryIncomeHistoriesRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserIncomesHistoriesUseCase

describe('Fetch user incomes history use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()

    incomeHistoriesRepository = new InMemoryIncomeHistoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserIncomesHistoriesUseCase(
      incomeHistoriesRepository,
      incomesRepository,
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

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 2; i++) {
      await incomeHistoriesRepository.create({
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        income_id: income.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      incomeId: income.id,
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

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await incomeHistoriesRepository.create({
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: 'non-existing-id',
        income_id: income.id,
      })
    }

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        incomeId: income.id,
        searchParams: {
          page: 3,
          per_page: 10,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to fetch histories without a income', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        incomeId: 'no-one-income-id',
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

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await incomeHistoriesRepository.create({
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        income_id: income.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      incomeId: income.id,
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

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: `category-48`,
      user_id: user.id,
    })

    for (let i = 1; i <= 22; i++) {
      await incomeHistoriesRepository.create({
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        income_id: income.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      incomeId: income.id,
      searchParams: {
        pagination_disabled: true,
      },
    })

    expect(results).toHaveLength(22)
  })

  it('should be able to fetch incomes using created at and name and sort from most recent', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
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

      await incomeHistoriesRepository.create({
        name,
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: new Date(),
        income_id: income.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      incomeId: income.id,
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

    const incomeHistories = results[0]

    const createdAtIncome = dayjs(incomeHistories.created_at).format('YYYY-MM')

    expect(incomeHistories.name).toContain('job')
    expect(createdAtIncome).toBe('2000-04')
  })
})

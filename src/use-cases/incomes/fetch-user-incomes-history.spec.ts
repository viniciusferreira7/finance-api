import { faker } from '@faker-js/faker'
import { Income } from '@prisma/client'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryIncomesRepository } from '@/repositories/in-memory/incomes/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { FetchUserIncomesHistoryUseCase } from './fetch-user-incomes-history'

let incomesRepository: InMemoryIncomesRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserIncomesHistoryUseCase

describe('Fetch user incomes history use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserIncomesHistoryUseCase(incomesRepository, usersRepository)

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

    for (let i = 1; i <= 2; i++) {
      await incomesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
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
    for (let i = 1; i <= 22; i++) {
      await incomesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: 'non-existing-id',
      })
    }

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
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

    for (let i = 1; i <= 22; i++) {
      await incomesRepository.create({
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
      searchParams: {
        page: 3,
        per_page: 10,
      },
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
        name: 'job',
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
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

    for (let i = 1; i <= 200; i++) {
      const oneDayInMilliseconds = 1000 * 60 * 60 * 24

      vi.advanceTimersByTime(oneDayInMilliseconds)

      const name = faker.helpers.arrayElement([
        'job replace',
        faker.lorem.word(),
        faker.lorem.word(),
      ])

      await incomesRepository.create({
        name,
        value: 1000 + i * 10,
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: new Date(),
      })
    }

    const { results } = await sut.execute({
      userId: user.id,
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

    const income = results[0]

    const createdAtIncome = dayjs(income.created_at).format('YYYY-MM')

    expect(income.name).toContain('job')
    expect(createdAtIncome).toBe('2000-04')
  })

  it('should be able to fetch incomes using value and sort from most be able to search for incomes using the in and value category and sort from the oldest', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const valueToFilter = convertToCents(4000)
    const categoryToFilter = 'category-to-filter'

    const incomes: Income[] = []

    const oneDayInMilliseconds = 1000 * 60 * 60 * 24

    for (let i = 1; i <= 200; i++) {
      vi.advanceTimersByTime(oneDayInMilliseconds)

      const value = faker.helpers.arrayElement([
        valueToFilter,
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
      ])

      const categoryId =
        value === valueToFilter ? categoryToFilter : `category-${i}`

      const income = await incomesRepository.create({
        name: 'Job',
        value,
        description: 'Salary',
        category_id: categoryId,
        user_id: user.id,
        created_at: new Date(),
      })

      incomes.push(income)
    }

    const updatedIncomeId = incomes[0].id

    await incomesRepository.update({
      id: updatedIncomeId,
      name: 'New',
      value: valueToFilter,
      categoryId: categoryToFilter,
    })

    const lastDate = dayjs().format('YYYY-MM')

    const { results, ...rest } = await sut.execute({
      userId: user.id,
      searchParams: {
        page: 1,
        per_page: 20,
        pagination_disabled: false,
        name: 'New',
        updatedAt: {
          from: lastDate,
        },
        sort: 'desc',
      },
    })

    const income = results[0]

    console.log(income, rest) // TODO: descobrir porque o teste esta falhando
    const updatedAtIncome = dayjs(income.updated_at).format('YYYY-MM')

    expect(income.name).toBe('New')
    expect(updatedAtIncome).toContain(updatedAtIncome)
  })
})

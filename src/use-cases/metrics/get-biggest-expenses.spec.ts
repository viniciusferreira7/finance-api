import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryMetricsRepository } from '@/repositories/in-memory/metrics/in-memory-metrics-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetBiggestExpensesUseCase } from './get-biggest-expenses'

let usersRepository: InMemoryUsersRepository
let metricsRepository: InMemoryMetricsRepository
let sut: GetBiggestExpensesUseCase

describe('Get Biggest Expenses', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    metricsRepository = new InMemoryMetricsRepository()
    sut = new GetBiggestExpensesUseCase(usersRepository, metricsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should able to get biggest expenses', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 500; i++) {
      metricsRepository.expenses.push({
        id: randomUUID(),
        name: 'video game',
        value: convertToCents(
          Number(faker.commerce.price({ min: 10, max: 1_000 })),
        ),
        description: 'Course',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
    }

    const biggestExpenses = await sut.execute({
      userId: user.id,
    })

    expect(biggestExpenses.length).toBeLessThanOrEqual(10)
    expect(biggestExpenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          value: expect.any(String),
          category_id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      ]),
    )
  })

  it('should able to get biggest expenses filtering by date', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 500; i++) {
      metricsRepository.incomes.push({
        id: randomUUID(),
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
      metricsRepository.expenses.push({
        id: randomUUID(),
        name: 'video game',
        value: (100 + i * 10).toString(),
        description: 'Course',
        category_id: `category-${i}`,
        user_id: user.id,
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
    }

    const endDate = dayjs('1999-01')

    const summary = await sut.execute({
      userId: user.id,
      endDate: endDate.format('YYYY-MM'),
    })

    expect(
      summary.every((item, index) => {
        const expectedMonth = endDate
          .add(1, 'month')
          .subtract(1 + index, 'months')
          .format('YYYY-MM')

        const createdAt = dayjs(item.created_at).format('YYYY-MM')

        return createdAt === expectedMonth
      }),
    ).toEqual(true)
  })

  it('should able to get biggest expenses without user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

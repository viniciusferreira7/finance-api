import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryMetricsRepository } from '@/repositories/in-memory/metrics/in-memory-metrics-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetMonthlyBalanceOverTimeUseCase } from './get-monthly-balance-over-time'

let usersRepository: InMemoryUsersRepository
let metricsRepository: InMemoryMetricsRepository
let sut: GetMonthlyBalanceOverTimeUseCase

describe('Get Monthly Balance Over Time', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    metricsRepository = new InMemoryMetricsRepository()
    sut = new GetMonthlyBalanceOverTimeUseCase(
      usersRepository,
      metricsRepository,
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should able to get monthly balance over time', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    for (let i = 1; i <= 500; i++) {
      metricsRepository.incomes.push({
        id: randomUUID(),
        name: 'job',
        value: convertToCents(
          Number(faker.finance.amount({ min: 100, max: 1_000 })),
        ),
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
        value: convertToCents(
          Number(faker.finance.amount({ min: 100, max: 900 })),
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

    const balanceOverTime = await sut.execute({
      userId: user.id,
    })

    expect(balanceOverTime.length).toBeLessThanOrEqual(12)
    expect(balanceOverTime).toEqual(
      expect.objectContaining([
        {
          date: expect.any(String),
          balance: expect.any(Number),
        },
      ]),
    )
  })

  it('should able to get monthly financial balance over time filtering by date', async () => {
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

    const balanceOverTime = await sut.execute({
      userId: user.id,
      endDate: endDate.format('YYYY-MM'),
    })

    expect(
      balanceOverTime.every((item, index) => {
        const expectedMonth = endDate
          .add(1, 'month')
          .subtract(1 + index, 'months')
          .format('YYYY-MM')

        return item.date === expectedMonth
      }),
    ).toEqual(true)
  })

  it('should able to get monthly financial balance over time without user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

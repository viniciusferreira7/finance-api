import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryMetricsRepository } from '@/repositories/in-memory/metrics/in-memory-metrics-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetMonthlyFinancialSummaryUseCase } from './get-monthly-financial-summary'

let usersRepository: InMemoryUsersRepository
let metricsRepository: InMemoryMetricsRepository
let sut: GetMonthlyFinancialSummaryUseCase

describe('Get Monthly financial summary', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    metricsRepository = new InMemoryMetricsRepository()
    sut = new GetMonthlyFinancialSummaryUseCase(
      usersRepository,
      metricsRepository,
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should able to get monthly financial summary', async () => {
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

    const summary = await sut.execute({
      userId: user.id,
    })

    expect(summary.length).toBeGreaterThanOrEqual(12)
    expect(summary).toEqual(
      expect.objectContaining([
        {
          date: expect.any(String),
          incomes_total: expect.any(Number),
          expenses_total: expect.any(Number),
        },
      ]),
    )
  })

  it('should able to get monthly financial summary filtering by date', async () => {
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
          .subtract(1 + index, 'months')
          .format('YYYY-MM')

        return item.date === expectedMonth
      }),
    )
  })

  it('should able to get monthly financial summary without user id', async () => {
    for (let i = 1; i <= 1; i++) {
      metricsRepository.incomes.push({
        id: randomUUID(),
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: `category-${i}`,
        user_id: 'non-user-id',
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
        user_id: 'non-user-id',
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
    }

    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

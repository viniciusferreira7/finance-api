// TODO: criar o test
import { faker } from '@faker-js/faker'
import type { Category } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryMetricsRepository } from '@/repositories/in-memory/metrics/in-memory-metrics-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetCategoriesWithTheMostRecordUseCase } from './get-categories-with-the-most-record'

let usersRepository: InMemoryUsersRepository
let metricsRepository: InMemoryMetricsRepository
let sut: GetCategoriesWithTheMostRecordUseCase

describe('Get categories with the most records', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    metricsRepository = new InMemoryMetricsRepository()
    sut = new GetCategoriesWithTheMostRecordUseCase(
      usersRepository,
      metricsRepository,
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should able to  categories with the most records', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const categories: Category[] = []

    for (let i = 1; i <= 20; i++) {
      categories.push({
        id: randomUUID(),
        name: faker.finance.accountName(),
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: user.id,
      })
    }

    metricsRepository.categories.push(...categories)

    for (let i = 1; i <= 500; i++) {
      const categoryId = faker.helpers.arrayElement(
        categories.map((category) => category.id),
      )

      metricsRepository.incomes.push({
        id: randomUUID(),
        name: 'job',
        value: (1000 + i * 10).toString(),
        description: 'Salary',
        category_id: categoryId,
        user_id: user.id,
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
    }

    for (let i = 1; i <= 500; i++) {
      const categoryId = faker.helpers.arrayElement(
        categories.map((category) => category.id),
      )

      metricsRepository.expenses.push({
        id: randomUUID(),
        name: 'video game',
        value: (100 + i * 10).toString(),
        description: 'Course',
        category_id: categoryId,
        user_id: user.id,
        created_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
        updated_at: dayjs()
          .subtract(i + 1, 'weeks')
          .toDate(),
      })
    }

    const results = await sut.execute({
      userId: user.id,
    })

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          incomes_quantity: expect.any(Number),
          expenses_quantity: expect.any(Number),
        }),
      ]),
    )
  })

  it('should able to get monthly financial summary without user id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

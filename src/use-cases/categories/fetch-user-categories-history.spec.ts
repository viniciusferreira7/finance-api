import { faker } from '@faker-js/faker'
import { Category } from '@prisma/client'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { FetchUserCategoriesHistoryUseCase } from './fetch-user-categories-history'

let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserCategoriesHistoryUseCase

describe('Fetch user categories history use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserCategoriesHistoryUseCase(
      categoriesRepository,
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

    for (let i = 1; i <= 2; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',

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
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: `category-1` }),
        expect.objectContaining({ name: 'category-2' }),
      ]),
    )
  })

  it('should not be able to fetch history without a user', async () => {
    for (let i = 1; i <= 22; i++) {
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',

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
      await categoriesRepository.create({
        name: `category-${i}`,
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',

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

  it('should be able to fetch categories using created at and name and sort from most recent', async () => {
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

      await categoriesRepository.create({
        name,
        description: 'Salary',
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

    const category = results[0]

    const createdAtCategory = dayjs(category.created_at).format('YYYY-MM')

    expect(category.name).toContain('job')
    expect(createdAtCategory).toBe('2000-04')
  })

  it('should be able to fetch categories using value and sort from most be able to search for categories using the in and sort from the oldest', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const categories: Category[] = []

    const oneDayInMilliseconds = 1000 * 60 * 60 * 24

    for (let i = 1; i <= 200; i++) {
      vi.advanceTimersByTime(oneDayInMilliseconds)

      const category = await categoriesRepository.create({
        name: 'Job',
        description: 'Salary',
        user_id: user.id,
        created_at: new Date(),
      })

      categories.push(category)
    }

    const updatedCategoryId = categories[0].id

    await categoriesRepository.update({
      id: updatedCategoryId,
      name: 'New',
    })

    const lastDate = dayjs().format('YYYY-MM')

    const { results } = await sut.execute({
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

    const category = results[0]

    const updatedAtCategory = dayjs(category.updated_at).format('YYYY-MM')

    expect(category.name).toBe('New')
    expect(updatedAtCategory).toContain(lastDate)
  })
})

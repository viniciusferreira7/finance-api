import { describe } from 'node:test'

import { hash } from 'bcryptjs'
import { beforeEach, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryIncomeHistoriesRepository } from '@/repositories/in-memory/in-memory-income-histories-repository'
import { InMemoryIncomesRepository } from '@/repositories/in-memory/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { CreateIncomeUseCase } from './create-income'
import { ResourceNotFound } from './error/resource-not-found-error'

let incomesRepository: InMemoryIncomesRepository
let incomeHistories: InMemoryIncomeHistoriesRepository
let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: UsersRepository

let sut: CreateIncomeUseCase

describe('Create income use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()
    incomeHistories = new InMemoryIncomeHistoriesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateIncomeUseCase(
      incomesRepository,
      incomeHistories,
      categoriesRepository,
      usersRepository,
    )
  })

  it('should be able to create an income', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'work',
      description: 'company',
      user_id: user.id,
    })

    const { income } = await sut.execute({
      name: 'job',
      value: 1000,
      description: 'Salary',
      category_id: category.id,
      user_id: user.id,
    })

    expect(income.id).toEqual(expect.any(String))
  })

  it('should not be able to create an income without a category', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        name: 'job',
        value: 1000,
        description: 'Salary',
        category_id: 'non-existing-category-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to create an income without a user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'work',
      description: 'company',
      user_id: user.id,
    })

    await expect(() =>
      sut.execute({
        name: 'job',
        value: 1000,
        description: 'Salary',
        category_id: category.id,
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

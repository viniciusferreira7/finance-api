import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryIncomesRepository } from '@/repositories/in-memory/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from './error/resource-not-found-error'
import { UpdateUserIncomeUseCase } from './update-user-income'

let incomesRepository: InMemoryIncomesRepository
let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: UsersRepository

let sut: UpdateUserIncomeUseCase

describe('Update user income use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new UpdateUserIncomeUseCase(
      incomesRepository,
      categoriesRepository,
      usersRepository,
    )
  })

  it('should be able to update an income', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      icon_name: 'arrow-right',
      user_id: user.id,
    })

    const income = await incomesRepository.create({
      name: 'job',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    const { income: updatedIncome } = await sut.execute({
      userId: user.id,
      updateIncome: {
        id: income.id,
        value: 5000,
        name: 'updated-income',
        description: null,
        categoryId: category.id,
      },
    })

    expect(updatedIncome).toEqual(
      expect.objectContaining({
        value: convertToCents(5000),
        name: 'updated-income',
        description: null,
      }),
    )
  })

  it('should not be able to update an income without a user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      icon_name: 'arrow-right',
      user_id: user.id,
    })

    const income = await incomesRepository.create({
      name: 'job',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        updateIncome: {
          id: income.id,
          value: 5000,
          name: 'updated-income',
          description: null,
          categoryId: category.id,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update a non-existent income', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        updateIncome: {
          id: 'non-existing-income-id',
          value: 5000,
          name: 'updated-income',
          description: null,
          categoryId: 'non-existing-category-id',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update an income without category', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      icon_name: 'arrow-right',
      user_id: user.id,
    })

    const income = await incomesRepository.create({
      name: 'job',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        updateIncome: {
          id: income.id,
          value: 5000,
          name: 'updated-income',
          description: null,
          categoryId: 'non-existing-category-id',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  // TODO: creates another test to update income
})

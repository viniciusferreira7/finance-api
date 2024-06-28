import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryExpenseHistoriesRepository } from '@/repositories/in-memory/expenses/in-memory-expense-histories-repository'
import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { UpdateUserExpenseUseCase } from './update-user-expense'

let expenseRepository: InMemoryExpensesRepository
let expenseHistoriesRepository: InMemoryExpenseHistoriesRepository
let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: UsersRepository

let sut: UpdateUserExpenseUseCase

describe('Update user expense use case', () => {
  beforeEach(() => {
    expenseRepository = new InMemoryExpensesRepository()
    expenseHistoriesRepository = new InMemoryExpenseHistoriesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new UpdateUserExpenseUseCase(
      expenseRepository,
      expenseHistoriesRepository,
      categoriesRepository,
      usersRepository,
    )
  })

  it('should be able to update an expense', async () => {
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

    const expense = await expenseRepository.create({
      name: 'groceries',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    const { expense: updatedExpense } = await sut.execute({
      userId: user.id,
      updateExpense: {
        id: expense.id,
        value: 5000,
        name: 'updated-expense',
        description: null,
        categoryId: category.id,
      },
    })

    expect(updatedExpense).toEqual(
      expect.objectContaining({
        value: convertToCents(5000),
        name: 'updated-expense',
        description: null,
      }),
    )
  })

  it('should not be able to update an expense without a user', async () => {
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

    const expense = await expenseRepository.create({
      name: 'groceries',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        updateExpense: {
          id: expense.id,
          value: 5000,
          name: 'updated-expense',
          description: null,
          categoryId: category.id,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update a non-existent expense', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        updateExpense: {
          id: 'non-existing-expense-id',
          value: 5000,
          name: 'updated-expense',
          description: null,
          categoryId: 'non-existing-category-id',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update an expense without category', async () => {
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

    const expense = await expenseRepository.create({
      name: 'groceries',
      value: 1000,
      user_id: user.id,
      category_id: category.id,
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        updateExpense: {
          id: expense.id,
          value: 5000,
          name: 'updated-expense',
          description: null,
          categoryId: 'non-existing-category-id',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  // TODO: creates another test to update expense
})

import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryExpenseHistoriesRepository } from '@/repositories/in-memory/in-memory-expense-histories-repository'
import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { CreateExpenseUseCase } from './create-expense'
import { ResourceNotFound } from './error/resource-not-found-error'

let expensesRepository: InMemoryExpensesRepository
let expenseHistoriesRepository: InMemoryExpenseHistoriesRepository
let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: UsersRepository

let sut: CreateExpenseUseCase

describe('Create income use case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository()
    expenseHistoriesRepository = new InMemoryExpenseHistoriesRepository()
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new CreateExpenseUseCase(
      expensesRepository,
      expenseHistoriesRepository,
      categoriesRepository,
      usersRepository,
    )
  })

  it('should be to create a expense', async () => {
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

    const { expense } = await sut.execute({
      name: 'video game',
      value: 1000,
      description: 'Salary',
      category_id: category.id,
      user_id: user.id,
    })

    expect(expense.id).toEqual(expect.any(String))
  })

  it('should not be able to create an expense without a category', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        name: 'video game',
        value: 1000,
        description: 'Salary',
        category_id: 'non-existing-category-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to create an expense without a user', async () => {
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
        name: 'video game',
        value: 1000,
        description: 'Salary',
        category_id: category.id,
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

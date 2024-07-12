import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetUserExpenseUseCase } from './get-user-expense'

let expensesRepository: InMemoryExpensesRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserExpenseUseCase

describe('Get user expense use case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserExpenseUseCase(expensesRepository, usersRepository)
  })

  it('should be able to get a specific expense by id', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdExpense = await expensesRepository.create({
      name: 'video game',
      value: 1000,
      description: 'elden ring',
      category_id: 'category-01',
      user_id: user.id,
    })

    const { expense } = await sut.execute({
      userId: user.id,
      expenseId: createdExpense.id,
    })

    expect(expense).toEqual(
      expect.objectContaining({
        name: 'video game',
        value: 1000,
        description: 'elden ring',
        category_id: 'category-01',
        user_id: user.id,
      }),
    )
  })

  it('should not be able to get a specific expense by id without a user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdExpense = await expensesRepository.create({
      name: 'video game',
      value: 1000,
      description: 'elden ring',
      category_id: 'category-01',
      user_id: user.id,
    })

    await sut.execute({
      userId: user.id,
      expenseId: createdExpense.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
        expenseId: createdExpense.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to get a specific expense by id without an existing expense', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        expenseId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryExpenseHistoriesRepository } from '@/repositories/in-memory/expenses/in-memory-expense-histories-repository'
import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { DeleteUserExpense } from './delete-user-expense'

let expensesRepository: InMemoryExpensesRepository
let expenseHistoriesRepository: InMemoryExpenseHistoriesRepository
let usersRepository: InMemoryUsersRepository

let sut: DeleteUserExpense

describe('Delete user expense use case', () => {
  beforeEach(() => {
    expensesRepository = new InMemoryExpensesRepository()
    expenseHistoriesRepository = new InMemoryExpenseHistoriesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new DeleteUserExpense(
      expensesRepository,
      expenseHistoriesRepository,
      usersRepository,
    )
  })

  it('should be able to delete an existing expense', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
      name: 'game',
      value: 1000,
      user_id: user.id,
      category_id: 'non-existing',
    })

    const { expense: deletedExpense } = await sut.execute({
      userId: user.id,
      expenseId: expense.id,
    })

    expect(deletedExpense?.id).toEqual(expect.any(String))
  })

  it('should not be able to delete an existing expense without user', async () => {
    const expense = await expensesRepository.create({
      name: 'game',
      value: 1000,
      user_id: 'user-1',
      category_id: 'non-existing',
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing',
        expenseId: expense.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete an inexistent expense', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        expenseId: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryExpensesRepository } from '@/repositories/in-memory/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { DeleteUserExpense } from './delete-user-expense'
import { ResourceNotFound } from './error/resource-not-found-error'

let expensesRepository: InMemoryExpensesRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteUserExpense

describe('Delete user expense use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    expensesRepository = new InMemoryExpensesRepository()
    sut = new DeleteUserExpense(expensesRepository, usersRepository)
  })

  it('should be able to delete an existing expense', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const expense = await expensesRepository.create({
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

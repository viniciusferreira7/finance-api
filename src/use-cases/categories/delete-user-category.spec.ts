import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryIncomesRepository } from '@/repositories/in-memory/incomes/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { DeleteUserCategory } from './delete-user-category'

let categoriesRepository: InMemoryCategoriesRepository
let incomesRepository: InMemoryIncomesRepository
let expensesRepository: InMemoryExpensesRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteUserCategory

describe('Delete user category use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    incomesRepository = new InMemoryIncomesRepository()
    expensesRepository = new InMemoryExpensesRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new DeleteUserCategory(
      categoriesRepository,
      incomesRepository,
      expensesRepository,
      usersRepository,
    )
  })

  it('should be able to delete a user category', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: `category-1`,
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',

      user_id: user.id,
    })

    const { category: deletedCategory } = await sut.execute({
      userId: user.id,
      categoryId: category.id,
    })

    expect(deletedCategory?.id).toEqual(expect.any(String))
  })

  it('should not be able to delete category without a user', async () => {
    const category = await categoriesRepository.create({
      name: `category-1`,
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',

      user_id: 'non-existing',
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing',
        categoryId: category.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete an inexistent category', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        categoryId: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

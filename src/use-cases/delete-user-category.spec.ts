import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { DeleteUserCategory } from './delete-user-category'
import { ResourceNotFound } from './error/resource-not-found-error'

let categoriesRepository: CategoriesRepository
let usersRepository: UsersRepository
let sut: DeleteUserCategory

describe('Delete user category use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserCategory(categoriesRepository, usersRepository)
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
      icon_name: 'arrow-right',
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
      icon_name: 'arrow-right',
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
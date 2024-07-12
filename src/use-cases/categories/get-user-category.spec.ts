import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetUserCategoryUseCase } from './get-user-category'

let categoriesRepository: InMemoryCategoriesRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserCategoryUseCase

describe('Get user category use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserCategoryUseCase(categoriesRepository, usersRepository)
  })

  it('should be able to get a specific category by id', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdCategory = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      user_id: user.id,
    })

    const { category } = await sut.execute({
      userId: user.id,
      categoryId: createdCategory.id,
    })

    expect(category).toEqual(
      expect.objectContaining({
        name: 'category-01',
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        user_id: user.id,
      }),
    )
  })

  it('should not be able to get a specific category by id without a user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdCategory = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      user_id: user.id,
    })

    await sut.execute({
      userId: user.id,
      categoryId: createdCategory.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
        categoryId: createdCategory.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

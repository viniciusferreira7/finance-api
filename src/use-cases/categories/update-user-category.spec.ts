import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { UpdateUserCategoryUseCase } from './update-user-category'

let categoriesRepository: CategoriesRepository
let usersRepository: UsersRepository
let sut: UpdateUserCategoryUseCase

describe('Update category use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserCategoryUseCase(categoriesRepository, usersRepository)
  })

  it('should be able to update a category', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      user_id: user.id,
    })

    const { category: updatedCategory } = await sut.execute({
      userId: user.id,
      category: {
        id: category.id,
        name: 'category-02',
        description: null,
      },
    })

    expect(updatedCategory).toEqual(
      expect.objectContaining({ name: 'category-02', description: '' }),
    )
  })

  it('should not be able to update a category without a user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const category = await categoriesRepository.create({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      user_id: user.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
        category: {
          id: category.id,
          name: 'category-01',
          description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update a category without an existing category', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        category: {
          id: 'non-existing-id',
          name: 'category-01',
          description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

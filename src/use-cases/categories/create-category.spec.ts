import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { InMemoryCategoriesRepository } from '@/repositories/in-memory/categories/in-memory-categories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { CategoryAlreadyExistError } from '../error/category-already-exist-error'
import { ResourceNotFound } from '../error/resource-not-found-error'
import { CreateCategoryUseCase } from './create-category'

let categoriesRepository: CategoriesRepository
let usersRepository: UsersRepository
let sut: CreateCategoryUseCase

describe('Create category use case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateCategoryUseCase(categoriesRepository, usersRepository)
  })

  it('should be able to create a new category', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { category } = await sut.execute({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      iconName: 'arrow-right',
      userId: user.id,
    })

    expect(category.id).toEqual(expect.any(String))
  })

  it('should not be able to create a new category without a user', async () => {
    await expect(() =>
      sut.execute({
        name: 'category-01',
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        iconName: 'arrow-right',
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to create a new category with the same name as an existing category', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await sut.execute({
      name: 'category-01',
      description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      iconName: 'arrow-right',
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        name: 'category-01',
        description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        iconName: 'arrow-right',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(CategoryAlreadyExistError)
  })
})

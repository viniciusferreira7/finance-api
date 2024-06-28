import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'
import { GetUserProfileUserCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUserCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUserCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user).toEqual(
      expect.objectContaining({ name: 'John', email: 'john@example.com' }),
    )
  })

  it('should not be able to get user with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

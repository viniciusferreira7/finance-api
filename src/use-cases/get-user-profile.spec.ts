import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it } from 'vitest'
import { GetUserProfileUserCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFound } from './error/resource-not-found-error'

describe('Get user profile use case', () => {
  it('should be able to get user profile', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUserCase(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUserCase(usersRepository)

    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

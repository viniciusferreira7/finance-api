import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExists } from './error/user-already-exists-error'

describe('Register use case', () => {
  it('should be able to hash password upon registration', async () => {
    const usersRepository = new PrismaUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const password = '123456'

    const { user } = await sut.execute({
      name: 'John',
      email: 'john.doe5@example.com',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new PrismaUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const email = 'john.doe@example.com'

    // await sut.execute({
    //   name: 'John',
    //   email,
    //   password: '12345',
    // })

    await expect(() =>
      sut.execute({
        name: 'John',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})

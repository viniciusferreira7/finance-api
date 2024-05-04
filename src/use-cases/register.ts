import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExists } from './error/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}

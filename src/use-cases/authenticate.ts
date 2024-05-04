import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

import { InvalidCredentialsError } from './error/invalid-credentials-error'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}

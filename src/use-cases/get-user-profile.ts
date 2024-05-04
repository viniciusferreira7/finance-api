import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface GetUserProfileRequest {
  userId: string
}

interface GetUserProfileResponse {
  user: User
}

export class GetUserProfileUserCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    return { user }
  }
}

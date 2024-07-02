import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { GetUserProfileUserCase } from '../../users/get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUserCase(usersRepository)

  return useCase
}

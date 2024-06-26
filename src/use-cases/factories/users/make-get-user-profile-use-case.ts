import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { GetUserProfileUserCase } from '../../users/get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUserCase(usersRepository)

  return useCase
}

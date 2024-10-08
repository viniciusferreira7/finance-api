import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { AuthenticateUseCase } from '../../users/authenticate'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(userRepository)

  return useCase
}

import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { RegisterUseCase } from '../../users/register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(usersRepository)

  return useCase
}

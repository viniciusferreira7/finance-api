import { PrismaIncomesRepository } from '@/repositories/prisma/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DeleteUserIncome } from '../delete-user-income'

export function makeDeleteUserIncome() {
  const incomesRepository = new PrismaIncomesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserIncome(incomesRepository, usersRepository)

  return useCase
}

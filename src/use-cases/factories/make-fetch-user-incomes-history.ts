import { PrismaIncomesRepository } from '@/repositories/prisma/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { FetchUserIncomesHistoryUseCase } from '../fetch-user-incomes-history'

export function makeFetchUserIncomesHistory() {
  const incomesRepository = new PrismaIncomesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserIncomesHistoryUseCase(
    incomesRepository,
    usersRepository,
  )

  return useCase
}

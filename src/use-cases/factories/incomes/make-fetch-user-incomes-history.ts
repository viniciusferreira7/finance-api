import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { FetchUserIncomesHistoryUseCase } from '../../incomes/fetch-user-incomes-history'

export function makeFetchUserIncomesHistory() {
  const incomesRepository = new PrismaIncomesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserIncomesHistoryUseCase(
    incomesRepository,
    usersRepository,
  )

  return useCase
}

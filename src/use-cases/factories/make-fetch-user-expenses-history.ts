import { PrismaExpensesRepository } from '@/repositories/prisma/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { FetchUserExpensesHistoryUseCase } from '../fetch-user-expenses-history'

export function makeFetchUserExpensesHistory() {
  const expensesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserExpensesHistoryUseCase(
    expensesRepository,
    usersRepository,
  )

  return useCase
}

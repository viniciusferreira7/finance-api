import { PrismaIncomeHistoriesRepository } from '@/repositories/prisma/incomes/prisma-income-histories-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { FetchUserIncomesHistoriesUseCase } from '@/use-cases/incomes/fetch-income-histories'

export function makeFetchUserIncomeHistories() {
  const incomesRepository = new PrismaIncomesRepository()
  const incomeHistoriesRepository = new PrismaIncomeHistoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserIncomesHistoriesUseCase(
    incomeHistoriesRepository,
    incomesRepository,
    usersRepository,
  )

  return useCase
}

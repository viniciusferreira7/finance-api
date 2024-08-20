import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetMetricsMonthlyIncome } from '@/use-cases/incomes/get-metrics-monthly-income'

export function makeGetMetricsMonthlyIncome() {
  const incomesRepository = new PrismaIncomesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetMetricsMonthlyIncome(
    usersRepository,
    incomesRepository,
  )

  return useCase
}

import { PrismaMetricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetBiggestExpensesUseCase } from '@/use-cases/metrics/get-biggest-expenses'

export function makeGetBiggestExpensesUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const metricsRepository = new PrismaMetricsRepository()
  const useCase = new GetBiggestExpensesUseCase(
    usersRepository,
    metricsRepository,
  )

  return useCase
}

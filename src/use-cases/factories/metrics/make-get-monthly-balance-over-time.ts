import { PrismaMetricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetMonthlyBalanceOverTimeUseCase } from '@/use-cases/metrics/get-monthly-balance-over-time'

export function makeGetMonthlyBalanceOverTimeUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const metricsRepository = new PrismaMetricsRepository()
  const useCase = new GetMonthlyBalanceOverTimeUseCase(
    usersRepository,
    metricsRepository,
  )

  return useCase
}

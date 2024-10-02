import { PrismaMetricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetTheBalanceOverTimeUseCase } from '@/use-cases/metrics/get-the-balance-over-time'

export function makeGetTheBalanceOverTimeUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const metricsRepository = new PrismaMetricsRepository()
  const useCase = new GetTheBalanceOverTimeUseCase(
    usersRepository,
    metricsRepository,
  )

  return useCase
}

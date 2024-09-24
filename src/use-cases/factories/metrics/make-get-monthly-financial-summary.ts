import { PrismaMetricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetMonthlyFinancialSummaryUseCase } from '@/use-cases/metrics/get-monthly-financial-summary'

export function makeGetMonthlyFinancialSummary() {
  const usersRepository = new PrismaUsersRepository()
  const metricsRepository = new PrismaMetricsRepository()
  const useCase = new GetMonthlyFinancialSummaryUseCase(
    usersRepository,
    metricsRepository,
  )

  return useCase
}

import { PrismaMetricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetCategoriesWithTheMostRecordUseCase } from '@/use-cases/metrics/get-categories-with-the-most-record'

export function makeGetCategoriesWithTheMostRecordUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const metricsRepository = new PrismaMetricsRepository()
  const useCase = new GetCategoriesWithTheMostRecordUseCase(
    usersRepository,
    metricsRepository,
  )

  return useCase
}

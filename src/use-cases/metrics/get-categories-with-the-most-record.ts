import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetCategoriesWithTheMostRecordRequestUseCase {
  userId: string
}

type GetCategoriesWithTheMostRecordResponseUseCase = Array<{
  name: string
  incomes_quantity: number
  expenses_quantity: number
}>

export class GetCategoriesWithTheMostRecordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
  }: GetCategoriesWithTheMostRecordRequestUseCase): Promise<GetCategoriesWithTheMostRecordResponseUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }
    const metrics =
      await this.metricsRepository.findCategoriesWithTheMostRecord({
        userId,
      })

    return metrics.slice(0, 10)
  }
}

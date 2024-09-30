import type { Expense } from '@prisma/client'

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetBiggestExpensesRequestUseCase {
  userId: string
}

type GetBiggestExpensesResponseUseCase = Expense[]

export class GetBiggestExpensesUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
  }: GetBiggestExpensesRequestUseCase): Promise<GetBiggestExpensesResponseUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }
    const metrics = await this.metricsRepository.findBiggestExpenses({
      userId,
    })

    return metrics.slice(0, 10)
  }
}

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetMonthlyFinancialSummaryRequestUseCase {
  userId: string
  startDate?: string
}

type GetMonthlyFinancialSummaryResponseUseCase = Array<{
  [key: string]: {
    incomes_total: number
    expenses_total: number
  }
}>

export class GetMonthlyFinancialSummary {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
    startDate,
  }: GetMonthlyFinancialSummaryRequestUseCase): Promise<GetMonthlyFinancialSummaryResponseUseCase> {
    const user = this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const metrics = this.metricsRepository.getMonthlyFinancialSummary({
      userId,
      startDate,
    })

    return metrics
  }
}

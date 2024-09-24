import dayjs from 'dayjs'

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetMonthlyFinancialSummaryRequestUseCase {
  userId: string
  endDate?: string
}

type GetMonthlyFinancialSummaryResponseUseCase = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>
export class GetMonthlyFinancialSummaryUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
    endDate,
  }: GetMonthlyFinancialSummaryRequestUseCase): Promise<GetMonthlyFinancialSummaryResponseUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const formattedEndDate = dayjs(endDate).isValid()
      ? dayjs(endDate).format('YYYY-MM')
      : dayjs().format('YYYY-MM')

    const metrics = await this.metricsRepository.getMonthlyFinancialSummary({
      userId,
      endDate: formattedEndDate,
    })

    return metrics.slice(0, 12)
  }
}

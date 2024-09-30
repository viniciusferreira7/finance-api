import type { Expense } from '@prisma/client'
import dayjs from 'dayjs'

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetBiggestExpensesRequestUseCase {
  userId: string
  endDate?: string
}

type GetBiggestExpensesResponseUseCase = Expense[]

export class GetBiggestExpensesUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
    endDate,
  }: GetBiggestExpensesRequestUseCase): Promise<GetBiggestExpensesResponseUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const formattedEndDate = dayjs(endDate).isValid()
      ? dayjs(endDate).format('YYYY-MM')
      : dayjs().format('YYYY-MM')

    const metrics = await this.metricsRepository.findBiggestExpenses({
      userId,
      endDate: formattedEndDate,
    })

    return metrics.slice(0, 10)
  }
}

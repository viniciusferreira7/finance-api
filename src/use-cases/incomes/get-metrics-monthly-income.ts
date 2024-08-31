import dayjs from 'dayjs'

import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetMetricsMonthlyIncomeRequest {
  userId: string
}

interface GetMetricsMonthlyIncomeResponse {
  amount: number
  diff_from_last_month: number
}

export class GetMetricsMonthlyIncome {
  constructor(
    private usersRepository: UsersRepository,
    private incomesRepository: IncomesRepository,
  ) {}

  async execute({
    userId,
  }: GetMetricsMonthlyIncomeRequest): Promise<GetMetricsMonthlyIncomeResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month').toDate()

    const metrics = await this.incomesRepository.getMetricsMonthly({
      userId,
      dates: {
        lastMonth: lastMonth.toDate(),
        startOfLastMonth,
      },
    })

    return { ...metrics }
  }
}

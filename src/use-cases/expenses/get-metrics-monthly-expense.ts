import dayjs from 'dayjs'

import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetMetricsMonthlyExpenseRequest {
  userId: string
}

interface GetMetricsMonthlyExpenseResponse {
  amount: number
  diff_from_last_month: number
}

export class GetMetricsMonthlyExpense {
  constructor(
    private usersRepository: UsersRepository,
    private expensesRepository: ExpensesRepository,
  ) {}

  async execute({
    userId,
  }: GetMetricsMonthlyExpenseRequest): Promise<GetMetricsMonthlyExpenseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month').format('YYYY-MM')

    const metrics = await this.expensesRepository.getMetricsMonthly({
      userId,
      dates: {
        lastMonth: lastMonth.format('YYYY-MM'),
        startOfLastMonth,
      },
    })

    return { ...metrics }
  }
}

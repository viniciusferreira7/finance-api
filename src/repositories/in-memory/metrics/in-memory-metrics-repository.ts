import type { Expense, Income } from '@prisma/client'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import type { metricsRepository } from '@/repositories/prisma/metrics/prisma-metrics-repository'

dayjs.extend(isBetween)

interface GetMonthlyFinancialSummary {
  userId: string
  endDate?: string
}

interface GetMonthlyFinancialSummaryResponse {
  date: string
  incomes_total: number
  expenses_total: number
}

interface SummaryByMonth {
  type: 'income' | 'expense'
  date: string
  total: number
}

export class InMemoryMetricsRepository implements metricsRepository {
  public incomes: Income[] = []
  public expenses: Expense[] = []

  async getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GetMonthlyFinancialSummary): Promise<
    GetMonthlyFinancialSummaryResponse[]
  > {
    const twelveMonthsBefore = dayjs(endDate).subtract(12, 'months')

    const incomesFiltered = this.incomes.filter((item) => {
      const fromTheUser = item.user_id === userId
      const createdAt = dayjs(item.created_at)

      return (
        fromTheUser &&
        createdAt.isBetween(
          twelveMonthsBefore,
          dayjs(endDate).add(1, 'month'),
          'month',
        )
      )
    })

    const expensesFiltered = this.expenses.filter((item) => {
      const fromTheUser = item.user_id === userId
      const createdAt = dayjs(item.created_at)

      return (
        fromTheUser &&
        createdAt.isBetween(
          twelveMonthsBefore,
          dayjs(endDate).add(1, 'month'),
          'month',
        )
      )
    })

    const incomesByMonth = incomesFiltered.map<SummaryByMonth>((item) => {
      return {
        type: 'income',
        date: dayjs(item.created_at).format('YYYY-MM'),
        total: Number(item.value),
      }
    })

    const expenseByMonth = expensesFiltered.map<SummaryByMonth>((item) => {
      return {
        type: 'expense',
        date: dayjs(item.created_at).format('YYYY-MM'),
        total: Number(item.value),
      }
    })

    const monthlySummary = [...incomesByMonth, ...expenseByMonth].reduce<
      GetMonthlyFinancialSummaryResponse[]
    >((acc, item) => {
      const sameDateIndex = acc.findIndex((entry) => entry.date === item.date)

      if (sameDateIndex !== -1) {
        if (item.type === 'income') {
          acc[sameDateIndex].incomes_total += item.total
        } else {
          acc[sameDateIndex].expenses_total += item.total
        }
      } else {
        acc.push({
          date: item.date,
          incomes_total: item.type === 'income' ? item.total : 0,
          expenses_total: item.type === 'expense' ? item.total : 0,
        })
      }

      return acc
    }, [])

    return monthlySummary
  }
}

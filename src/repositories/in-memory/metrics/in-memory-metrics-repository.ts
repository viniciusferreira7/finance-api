import type { Category, Expense, Income } from '@prisma/client'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import type {
  FindCategoriesWithTheMostRecordResponse,
  MetricsRepository,
} from '@/repositories/metrics-repository'

dayjs.extend(isBetween)

interface GenericParams {
  userId: string
  endDate?: string
}

type GetMonthlyBalanceOverTimeResponse = Array<{
  date: string
  balance: number
}>

interface CategoriesWithTheMostRecord {
  name: string
  incomes_quantity: number
  expenses_quantity: number
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

export class InMemoryMetricsRepository implements MetricsRepository {
  public categories: Category[] = []
  public incomes: Income[] = []
  public expenses: Expense[] = []

  async getMonthlyBalanceOverTime({
    userId,
    endDate,
  }: GenericParams): Promise<GetMonthlyBalanceOverTimeResponse> {
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

    const balanceOverTime = [
      ...incomesByMonth,
      ...expenseByMonth,
    ].reduce<GetMonthlyBalanceOverTimeResponse>((acc, item) => {
      const sameDateIndex = acc.findIndex((entry) => entry.date === item.date)

      if (sameDateIndex !== -1) {
        if (item.type === 'income') {
          acc[sameDateIndex].balance = Number(
            Number(acc[sameDateIndex].balance) + item.total,
          )
        } else {
          acc[sameDateIndex].balance = Number(
            Number(acc[sameDateIndex].balance) - item.total,
          )
        }
      } else {
        acc.push({
          date: item.date,
          balance:
            item.type === 'income' ? Number(item.total) : Number(-item.total),
        })
      }

      return acc
    }, [])

    return balanceOverTime
  }

  async findBiggestExpenses({
    userId,
    endDate,
  }: GenericParams): Promise<Expense[]> {
    const expensesByUser = this.expenses.filter(
      (expense) => expense.user_id === userId,
    )

    const expensesByEndDate = expensesByUser.filter((expense) => {
      if (endDate) {
        const formattedEndDate = dayjs(endDate).startOf('month').toDate()

        const isSameDate = dayjs(expense.created_at).isSame(formattedEndDate)

        return isSameDate
      }

      return true
    })

    const biggestExpenses = expensesByEndDate.sort((a, b) => {
      return Number(b.value) - Number(a.value)
    })

    return biggestExpenses
  }

  async findCategoriesWithTheMostRecord({
    userId,
  }: Omit<
    GenericParams,
    'endDate'
  >): Promise<FindCategoriesWithTheMostRecordResponse> {
    const categoriesByUserId = this.categories.filter(
      (item) => item.user_id === userId,
    )

    const incomesByCategory: Income[] = this.incomes.filter((income) => {
      return categoriesByUserId.some((category) => {
        return category.id === income.category_id && income.user_id === userId
      })
    })

    const expensesByCategory: Expense[] = this.expenses.filter((expense) => {
      return categoriesByUserId.some((category) => {
        return category.id === expense.category_id && expense.user_id === userId
      })
    })

    const categoryMostRecords =
      categoriesByUserId.map<CategoriesWithTheMostRecord>((category) => {
        const incomesQuantity = incomesByCategory.reduce<number>(
          (acc, income) => {
            if (income.category_id === category.id) {
              return acc + 1
            }

            return acc
          },
          0,
        )
        const expensesQuantity = expensesByCategory.reduce<number>(
          (acc, expense) => {
            if (expense.category_id === category.id) {
              return acc + 1
            }

            return acc
          },
          0,
        )

        return {
          name: category.name,
          incomes_quantity: incomesQuantity,
          expenses_quantity: expensesQuantity,
        }
      })

    const categoryMostRecordsSorted = categoryMostRecords.sort((a, b) => {
      const totalA = a.incomes_quantity + a.expenses_quantity
      const totalB = b.incomes_quantity + b.expenses_quantity

      return totalB - totalA
    })

    return categoryMostRecordsSorted
  }

  async getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GenericParams): Promise<GetMonthlyFinancialSummaryResponse[]> {
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

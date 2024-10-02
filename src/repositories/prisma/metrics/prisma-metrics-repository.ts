import type { Expense } from '@prisma/client'
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'
import type {
  FindCategoriesWithTheMostRecordResponse,
  MetricsRepository,
} from '@/repositories/metrics-repository'

interface GenericParams {
  userId: string
  endDate?: string
}

type GetMonthlyBalanceOverTimeResponse = Array<{
  date: string
  balance: number
}>

type GetMonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

export class PrismaMetricsRepository implements MetricsRepository {
  async getMonthlyBalanceOverTime({
    userId,
    endDate,
  }: GenericParams): Promise<GetMonthlyBalanceOverTimeResponse> {
    const metrics = await prisma.$queryRaw<GetMonthlyBalanceOverTimeResponse>`
      SELECT 
        TO_CHAR(date_trunc('month', months), 'YYYY-MM') AS date,
        COALESCE(SUM(i.value::numeric), 0) - COALESCE(SUM(e.value::numeric), 0) AS balance
      FROM generate_series(
            date_trunc('month', TO_DATE(${endDate}, 'YYYY-MM')) - INTERVAL '12 months', 
            date_trunc('month', TO_DATE(${endDate}, 'YYYY-MM')), 
            '1 month'
         ) AS months
      LEFT JOIN incomes i 
        ON date_trunc('month', i.created_at) = months
      AND i.user_id = ${userId}
      LEFT JOIN expenses e 
        ON date_trunc('month', e.created_at) = months
      AND e.user_id = ${userId}
      GROUP BY date
      ORDER BY date;`

    return metrics
  }

  async findBiggestExpenses({
    userId,
    endDate,
  }: GenericParams): Promise<Expense[]> {
    const expenses = await prisma.expense.findMany({
      where: {
        user_id: userId,
        created_at: {
          equals: endDate
            ? dayjs(endDate).startOf('month').toDate()
            : undefined,
        },
      },
      orderBy: {
        value: 'desc',
      },
      take: 20,
    })

    const biggestExpenses = expenses.sort((a, b) => {
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
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            Income: true,
            Expense: true,
          },
        },
      },
      where: {
        user_id: userId,
      },
    })

    const categoryMostRecords = categories.map((category) => ({
      name: category.name,
      incomes_quantity: category._count.Income,
      expenses_quantity: category._count.Expense,
    }))

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
  }: GenericParams): Promise<GetMonthlyFinancialSummaryResponse> {
    const metrics = await prisma.$queryRaw<GetMonthlyFinancialSummaryResponse>`
   SELECT 
      TO_CHAR(date_trunc('month', months), 'YYYY-MM') AS date,
      COALESCE(SUM(i.value::numeric), 0) AS incomes_total,
      COALESCE(SUM(e.value::numeric), 0) AS expenses_total,
      COALESCE(SUM(i.value::numeric), 0) - COALESCE(SUM(e.value::numeric), 0) AS balance
    FROM generate_series(
          date_trunc('month', TO_DATE(${endDate}, 'YYYY-MM')) - INTERVAL '12 months', 
          date_trunc('month', TO_DATE(${endDate}, 'YYYY-MM')), 
          '1 month'
       ) AS months
    LEFT JOIN incomes i 
      ON date_trunc('month', i.created_at) = months
    AND i.user_id = ${userId}
    LEFT JOIN expenses e 
      ON date_trunc('month', e.created_at) = months
    AND e.user_id = ${userId}
    GROUP BY date
    ORDER BY date;`

    return metrics
  }
}

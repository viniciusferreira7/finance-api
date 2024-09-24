import { prisma } from '@/lib/prisma'
import type { MetricsRepository } from '@/repositories/metrics-repository'

interface GetMonthlyFinancialSummary {
  userId: string
  endDate?: string
}

type GetMonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

export class PrismaMetricsRepository implements MetricsRepository {
  async getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GetMonthlyFinancialSummary): Promise<GetMonthlyFinancialSummaryResponse> {
    const metrics = await prisma.$queryRaw<GetMonthlyFinancialSummaryResponse>`
    SELECT 
      TO_CHAR(date_trunc('month', months), 'YYYY-MM') AS date,
      COALESCE(SUM(i.value::numeric), 0) AS incomes_total,
      COALESCE(SUM(e.value::numeric), 0) AS expenses_total
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

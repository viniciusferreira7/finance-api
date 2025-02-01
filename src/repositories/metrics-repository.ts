import type { Expense } from '@prisma/client'

interface GenericParams {
  userId: string
  endDate?: string
}

type GetMonthlyBalanceOverTimeResponse = Array<{
  date: string
  balance: number
}>

type FindCategoriesWithTheMostRecordResponse = Array<{
  name: string
  incomes_quantity: number
  expenses_quantity: number
}>

type GetMonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

export interface MetricsRepository {
  getMonthlyBalanceOverTime({
    userId,
    endDate,
  }: GenericParams): Promise<GetMonthlyBalanceOverTimeResponse>
  findBiggestExpenses({ userId, endDate }: GenericParams): Promise<Expense[]>
  findCategoriesWithTheMostRecord({
    userId,
  }: Omit<
    GenericParams,
    'endDate'
  >): Promise<FindCategoriesWithTheMostRecordResponse>
  getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GenericParams): Promise<GetMonthlyFinancialSummaryResponse>
}

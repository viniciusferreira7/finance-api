import type { Expense } from '@prisma/client'

interface GenericParams {
  userId: string
  endDate?: string
}

type GetTheBalanceOverTimeResponse = Array<{
  date: string
  balance: string
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
  getTheBalanceOverTime({
    userId,
    endDate,
  }: GenericParams): Promise<GetTheBalanceOverTimeResponse>
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

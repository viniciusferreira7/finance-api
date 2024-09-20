interface GetMonthlyFinancialSummary {
  userId: string
  endDate?: string
}

type GetMonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

export interface MetricsRepository {
  getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GetMonthlyFinancialSummary): Promise<GetMonthlyFinancialSummaryResponse>
}

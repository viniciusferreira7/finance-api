interface GetMonthlyFinancialSummary {
  userId: string
  startDate?: string
}

type GetMonthlyFinancialSummaryResponse = Array<{
  [key: string]: {
    incomes_total: number
    expenses_total: number
  }
}>

export interface MetricsRepository {
  getMonthlyFinancialSummary({
    userId,
    startDate,
  }: GetMonthlyFinancialSummary): Promise<GetMonthlyFinancialSummaryResponse>
}

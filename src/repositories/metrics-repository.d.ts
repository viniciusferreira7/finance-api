interface FindCategoriesWithTheMostRecord {
  userId: string
}

type FindCategoriesWithTheMostRecordResponse = Array<{
  name: string
  incomes_quantity: number
  expenses_quantity: number
}>

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
  findCategoriesWithTheMostRecord({
    userId,
  }: FindCategoriesWithTheMostRecord): Promise<FindCategoriesWithTheMostRecordResponse>
  getMonthlyFinancialSummary({
    userId,
    endDate,
  }: GetMonthlyFinancialSummary): Promise<GetMonthlyFinancialSummaryResponse>
}

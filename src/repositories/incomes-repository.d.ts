import { Income, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'

interface getMetricsMonthlyParams {
  userId: string
  dates: {
    lastMonth: Date
    startOfLastMonth: Date
  }
}

interface UpdateIncome {
  id: string
  name?: string
  value?: string
  description?: string | null
  categoryId?: string
}

export interface IncomesRepository {
  getMetricsMonthly(
    params: getMetricsMonthlyParams,
  ): Promise<{ amount: number; diff_from_last_month: number }>
  findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<Income>>
  findById(id: string): Promise<Income | null>
  delete(id: string): Promise<Income | null>
  updateManyByCategoryId(categoryId: string): Promise<number>
  update(updateIncome: UpdateIncome): Promise<Income | null>
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

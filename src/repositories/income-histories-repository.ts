import { IncomeHistory, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'

export interface IncomeHistoriesRepository {
  findManyByUserId(
    userId: string,
    incomeId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<IncomeHistory>>
  updateManyByCategoryId(categoryId: string): Promise<number>
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

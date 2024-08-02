import { IncomeHistory, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'

export interface IncomeHistoriesRepository {
  findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<IncomeHistory>>
  updateManyByCategoryId(categoryId: string): Promise<number>
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

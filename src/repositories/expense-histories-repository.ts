import type { ExpenseHistory, Prisma } from '@prisma/client'

import type { PaginationResponse } from '@/interfaces/pagination'
import type { SearchParams } from '@/interfaces/search-params'

export interface ExpenseHistoriesRepository {
  findManyByUserId(
    userId: string,
    expenseId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<ExpenseHistory>>
  updateManyByCategoryId(categoryId: string): Promise<number>
  deleteMany(expenseId: string, userId: string): Promise<number>
  create(
    data: Prisma.ExpenseHistoryUncheckedCreateInput,
  ): Promise<ExpenseHistory>
}

import { Expense, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'

interface UpdateExpense {
  id: string
  name?: string
  value?: number
  description?: string | null
  categoryId?: string
}

export interface ExpensesRepository {
  findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<Expense>>
  findById(id: string): Promise<Expense | null>
  delete(id: string): Promise<Expense | null>
  updateManyByCategoryId(categoryId: string): Promise<number>
  update(updateExpense: UpdateExpense): Promise<Expense | null>
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
}

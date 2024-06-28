import { Expense, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

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
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Expense>>
  findById(id: string): Promise<Expense | null>
  delete(id: string): Promise<Expense | null>
  updateManyByCategoryId(categoryId: string): Promise<number>
  update(updateExpense: UpdateExpense): Promise<Expense | null>
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
}

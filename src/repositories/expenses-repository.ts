import { Expense, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

export interface ExpensesRepository {
  findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Expense>>
  findById(id: string): Promise<Expense | null>
  delete(id: string): Promise<Expense | null>
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
}

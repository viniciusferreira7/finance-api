import { Expense, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

export interface ExpensesRepository {
  findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Expense>>
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
}

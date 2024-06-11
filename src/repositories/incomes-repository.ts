import { Income, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

export interface IncomesRepository {
  findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Income>>
  findById(id: string): Promise<Income | null>
  deleteIncome(id: string): Promise<Income | null>
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

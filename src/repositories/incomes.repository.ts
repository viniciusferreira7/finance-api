import { Income, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagintation'

export interface IncomesRepository {
  findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Income>>
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

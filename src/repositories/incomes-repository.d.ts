import { Income, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

interface UpdateIncome {
  id: string
  value?: number
  description?: string
  categoryId?: string
}

export interface IncomesRepository {
  findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Income>>
  findById(id: string): Promise<Income | null>
  delete(id: string): Promise<Income | null>
  update(updateIncome: UpdateIncome): Promise<Income | null>
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

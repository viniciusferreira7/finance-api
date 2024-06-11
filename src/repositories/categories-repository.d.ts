import { Category, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

export interface CategoriesRepository {
  findByUserIdAndName(userId: string, name: string): Promise<Category | null>
  findManyByUserId(
    userId: string,
    pagination?: Partial<PaginationRequest>,
  ): Promise<PaginationResponse<Category>>
  findById(id: string): Promise<Category | null>
  delete(id: string): Promise<Category | null>
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}

import { Category, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'

interface UpdateParams {
  userId: string
  category: {
    id: string
    name?: string
    description?: string
  }
}

export interface CategoriesRepository {
  findByUserIdAndName(userId: string, name: string): Promise<Category | null>
  findManyByUserId(
    userId: string,
    pagination?: Partial<PaginationRequest>,
  ): Promise<PaginationResponse<Category>>
  findById(id: string): Promise<Category | null>
  delete(id: string): Promise<Category | null>
  update(params: UpdateParams): Promise<Category>
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}

import { Category, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { CategorySearchParams } from '@/interfaces/search-params'

interface UpdateParams {
  id: string
  name?: string
  description?: string | null
}

export interface CategoriesRepository {
  findByUserIdAndName(userId: string, name: string): Promise<Category | null>
  findManyByUserId(
    userId: string,
    searchParams: Partial<CategorySearchParams>,
  ): Promise<PaginationResponse<Category>>
  findById(id: string): Promise<Category | null>
  delete(id: string): Promise<Category | null>
  update(params: UpdateParams): Promise<Category | null>
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}

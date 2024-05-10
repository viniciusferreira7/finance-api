import { Category, Prisma } from '@prisma/client'

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}

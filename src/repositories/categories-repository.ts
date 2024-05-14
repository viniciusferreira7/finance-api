import { Category, Prisma } from '@prisma/client'

export interface CategoriesRepository {
  findByUserIdAndName(userId: string, name: string): Promise<Category | null>
  findById(id: string): Promise<Category | null>
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}

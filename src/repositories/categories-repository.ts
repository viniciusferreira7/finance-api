import { Category } from '@prisma/client'

export interface CategoriesRepository {
  findById(id: string): Promise<Category | null>
}

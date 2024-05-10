import { Category } from '@prisma/client'

import { CategoriesRepository } from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public categories: Category[] = []

  async findById(id: string) {
    const category = this.categories.find((item) => item.id === id)

    if (!category) {
      return null
    }

    return category
  }
}

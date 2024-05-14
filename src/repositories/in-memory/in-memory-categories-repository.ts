import { Category, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { CategoriesRepository } from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public categories: Category[] = []

  async findByUserIdAndName(userId: string, name: string) {
    const category = this.categories.find((category) => {
      if (category.user_id === userId && category.name === name) {
        return category
      }

      return null
    })

    if (!category) {
      return null
    }

    return category
  }

  async findById(id: string) {
    const category = this.categories.find((item) => item.id === id)

    if (!category) {
      return null
    }

    return category
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
    }

    this.categories.push(category)

    return category
  }
}

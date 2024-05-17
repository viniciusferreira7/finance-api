import { Category, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { CategoriesRepository } from '../categories-repository'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public categories: Category[] = []

  async findByUserIdAndName(userId: string, name: string) {
    const category = this.categories.find((category) => {
      return category.user_id === userId && category.name === name
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
    const category: Category = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      icon_name: data.icon_name ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
    }

    this.categories.push(category)

    return category
  }
}

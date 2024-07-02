import { Category, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagination'

import { CategoriesRepository } from '../../categories-repository'

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

  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = this.categories.length

    const categories = this.categories.filter((item) => item.user_id === userId)

    if (pagination.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        total_pages: 1,
        per_page: count,
        pagination_disabled: !!pagination.pagination_disabled,
        results: categories,
      }
    }

    const perPage = pagination?.per_page ?? 10
    const currentPage = pagination?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const categoriesPaginated = categories.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage,
    )

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      total_pages: totalPages,
      per_page: perPage,
      pagination_disabled: !!pagination.pagination_disabled,
      results: categoriesPaginated,
    }
  }

  async findById(id: string) {
    const category = this.categories.find((item) => item.id === id)

    if (!category) {
      return null
    }

    return category
  }

  async delete(id: string) {
    const categoryIndex = this.categories.findIndex((item) => item.id === id)

    if (categoryIndex >= 0) {
      const category = this.categories[categoryIndex]

      this.categories.splice(categoryIndex, 1)

      return category
    }

    return null
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category: Category = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
    }

    this.categories.push(category)

    return category
  }
}

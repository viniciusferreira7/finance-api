import { Category, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { CategorySearchParams } from '@/@types/search-params'
import { compareDates } from '@/utils/compare-dates'

import { CategoriesRepository } from '../../categories-repository'

interface UpdateParams {
  id: string
  name?: string
  description?: string | null
}

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

  async findManyByUserId(
    userId: string,
    searchParams: Partial<CategorySearchParams>,
  ) {
    const categories = this.categories
      .filter((income) => {
        const createdAt = compareDates({
          date: income.created_at,
          from: searchParams?.createdAt?.from,
          to: searchParams?.createdAt?.to,
        })

        const updatedAt = compareDates({
          date: income.updated_at,
          from: searchParams?.updatedAt?.from,
          to: searchParams?.updatedAt?.to,
        })

        const name = searchParams.name
          ? income.name.includes(searchParams?.name)
          : true

        const description = searchParams.description
          ? income.description === searchParams?.description
          : true

        return createdAt && updatedAt && name && description
      })
      .sort((a, b) => {
        if (searchParams.sort === 'asc') {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      })

    const count = categories.length

    if (searchParams.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        total_pages: 1,
        per_page: count,
        pagination_disabled: !!searchParams.pagination_disabled,
        results: categories,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

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
      pagination_disabled: !!searchParams.pagination_disabled,
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

  async update(updateCategory: UpdateParams) {
    const categoryIndex = this.categories.findIndex(
      (item) => item.id === updateCategory.id,
    )

    if (categoryIndex >= 0) {
      let category = this.categories[categoryIndex]

      category = {
        ...category,
        name: updateCategory.name ?? category.name,
        description:
          updateCategory?.description === null
            ? ''
            : updateCategory.description ?? category.description,
        updated_at: new Date(),
      }

      this.categories.splice(categoryIndex, 1, category)

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
      updated_at: new Date(),
      user_id: data.user_id,
    }

    this.categories.push(category)

    return category
  }
}

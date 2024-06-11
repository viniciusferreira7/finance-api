import { Prisma } from '@prisma/client'

import { PaginationRequest } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'

import { CategoriesRepository } from '../categories-repository'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = await prisma.category.count({
      where: {
        user_id: userId,
      },
    })

    if (pagination.pagination_disabled) {
      const categories = await prisma.category.findMany({
        where: {
          user_id: userId,
        },
      })

      return {
        count,
        next: 0,
        previous: 0,
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

    const categoriesPaginated = await prisma.category.findMany({
      where: {
        user_id: userId,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    })

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

  async findByUserIdAndName(userId: string, name: string) {
    const category = await prisma.category.findFirst({
      where: {
        user_id: userId,
        name: {
          equals: name,
        },
      },
    })

    return category
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })

    return category
  }

  async delete(id: string) {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    })

    return category
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = await prisma.category.create({
      data,
    })

    return category
  }
}

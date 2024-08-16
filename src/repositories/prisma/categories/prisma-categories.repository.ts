import { Category, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { PaginationResponse } from '@/@types/pagination'
import { CategorySearchParams } from '@/@types/search-params'
import { prisma } from '@/lib/prisma'

import { CategoriesRepository } from '../../categories-repository'

interface UpdateParams {
  id: string
  name?: string
  description?: string
}

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findManyByUserId(
    userId: string,
    searchParams: Partial<CategorySearchParams>,
  ): Promise<PaginationResponse<Category>> {
    const isToGetCreatedAtOneDate =
      searchParams.createdAt?.from && !searchParams.createdAt?.to

    const isToGetUpdatedAtOneDate =
      searchParams.updatedAt?.from && !searchParams.updatedAt?.to

    const count = await prisma.category.count({
      where: {
        user_id: userId,
        name: {
          contains: searchParams.name,
        },
        created_at: isToGetCreatedAtOneDate
          ? {
              gte: dayjs(searchParams.createdAt?.from).startOf('date').toDate(),
              lte: dayjs(searchParams.createdAt?.from).endOf('date').toDate(),
            }
          : {
              gte:
                searchParams.createdAt?.from && searchParams.createdAt?.to
                  ? dayjs(searchParams.createdAt?.from).startOf('date').toDate()
                  : undefined,
              lte: searchParams.createdAt?.to
                ? dayjs(searchParams.createdAt?.to).endOf('date').toDate()
                : undefined,
            },
        updated_at: isToGetUpdatedAtOneDate
          ? {
              gte: dayjs(searchParams.updatedAt?.from).startOf('date').toDate(),
              lte: dayjs(searchParams.updatedAt?.from).endOf('date').toDate(),
            }
          : {
              gte:
                searchParams.updatedAt?.from && searchParams.updatedAt?.to
                  ? dayjs(searchParams.updatedAt?.from).startOf('date').toDate()
                  : undefined,
              lte: searchParams.updatedAt?.to
                ? dayjs(searchParams.updatedAt?.to).endOf('date').toDate()
                : undefined,
            },
      },
    })

    if (searchParams.pagination_disabled) {
      const categories = await prisma.category.findMany({
        where: {
          user_id: userId,
          name: {
            contains: searchParams.name,
          },
          description: {
            contains: searchParams.description,
          },
          created_at: isToGetCreatedAtOneDate
            ? {
                gte: dayjs(searchParams.createdAt?.from)
                  .startOf('date')
                  .toDate(),
                lte: dayjs(searchParams.createdAt?.from).endOf('date').toDate(),
              }
            : {
                gte:
                  searchParams.createdAt?.from && searchParams.createdAt?.to
                    ? dayjs(searchParams.createdAt?.from)
                        .startOf('date')
                        .toDate()
                    : undefined,
                lte: searchParams.createdAt?.to
                  ? dayjs(searchParams.createdAt?.to).endOf('date').toDate()
                  : undefined,
              },
          updated_at: isToGetUpdatedAtOneDate
            ? {
                gte: dayjs(searchParams.updatedAt?.from)
                  .startOf('date')
                  .toDate(),
                lte: dayjs(searchParams.updatedAt?.from).endOf('date').toDate(),
              }
            : {
                gte:
                  searchParams.updatedAt?.from && searchParams.updatedAt?.to
                    ? dayjs(searchParams.updatedAt?.from)
                        .startOf('date')
                        .toDate()
                    : undefined,
                lte: searchParams.updatedAt?.to
                  ? dayjs(searchParams.updatedAt?.to).endOf('date').toDate()
                  : undefined,
              },
        },
        orderBy: {
          created_at: 'asc',
        },
      })

      return {
        count,
        next: 0,
        previous: 0,
        page: 1,
        per_page: count,
        pagination_disabled: !!searchParams.pagination_disabled,
        total_pages: 1,
        results: categories,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const categoriesPaginated = await prisma.category.findMany({
      where: {
        user_id: userId,
        name: {
          contains: searchParams.name,
        },
        description: {
          equals: searchParams.description,
        },
        created_at: isToGetCreatedAtOneDate
          ? {
              gte: dayjs(searchParams.createdAt?.from).startOf('date').toDate(),
              lte: dayjs(searchParams.createdAt?.from).endOf('date').toDate(),
            }
          : {
              gte:
                searchParams.createdAt?.from && searchParams.createdAt?.to
                  ? dayjs(searchParams.createdAt?.from).startOf('date').toDate()
                  : undefined,
              lte: searchParams.createdAt?.to
                ? dayjs(searchParams.createdAt?.to).endOf('date').toDate()
                : undefined,
            },
        updated_at: isToGetUpdatedAtOneDate
          ? {
              gte: dayjs(searchParams.updatedAt?.from).startOf('date').toDate(),
              lte: dayjs(searchParams.updatedAt?.from).endOf('date').toDate(),
            }
          : {
              gte:
                searchParams.updatedAt?.from && searchParams.updatedAt?.to
                  ? dayjs(searchParams.updatedAt?.from).startOf('date').toDate()
                  : undefined,
              lte: searchParams.updatedAt?.to
                ? dayjs(searchParams.updatedAt?.to).endOf('date').toDate()
                : undefined,
            },
      },
      orderBy: {
        created_at: searchParams.sort ?? 'desc',
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    })

    // TODO: continue adding the filters in category, now you must have add in in-memory-category

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      per_page: perPage,
      total_pages: totalPages,
      pagination_disabled: !!searchParams.pagination_disabled,
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

  async update(category: UpdateParams) {
    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
        description: category.description,
        updated_at: new Date(),
      },
    })

    return updatedCategory
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = await prisma.category.create({
      data,
    })

    return category
  }
}

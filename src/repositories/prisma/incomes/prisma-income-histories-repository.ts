import { IncomeHistory, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'
import { prisma } from '@/lib/prisma'

import { IncomeHistoriesRepository } from '../../income-histories-repository'

export class PrismaIncomeHistoriesRepository
  implements IncomeHistoriesRepository
{
  async findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<IncomeHistory>> {
    const isToGetCreatedAtOneDate =
      searchParams.createdAt?.from && !searchParams.createdAt?.to

    const count = await prisma.incomeHistory.count({
      where: {
        user_id: userId,
        name: {
          contains: searchParams.name,
        },
        value: {
          equals: searchParams.value,
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
      },
    })

    if (searchParams.pagination_disabled) {
      const incomeHistories = await prisma.incomeHistory.findMany({
        where: {
          user_id: userId,
          name: {
            equals: searchParams.name,
          },
          value: {
            equals: searchParams.value,
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
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          category: true,
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
        results: incomeHistories,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const incomeHistoriesPaginated = await prisma.incomeHistory.findMany({
      where: {
        user_id: userId,
        name: {
          contains: searchParams.name,
        },
        value: {
          equals: searchParams.value,
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
      },
      orderBy: {
        created_at: searchParams.sort ?? 'desc',
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
      include: {
        category: true,
      },
    })

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
      results: incomeHistoriesPaginated,
    }
  }

  async updateManyByCategoryId(categoryId: string) {
    const { count } = await prisma.income.updateMany({
      where: {
        category_id: categoryId,
      },
      data: {
        category_id: undefined,
      },
    })

    return count
  }

  async deleteMany(incomeId: string, userId: string) {
    const { count } = await prisma.incomeHistory.deleteMany({
      where: {
        income_id: incomeId,
        user_id: userId,
      },
    })

    return count
  }

  async create(data: Prisma.IncomeHistoryUncheckedCreateInput) {
    const income = await prisma.incomeHistory.create({
      data,
    })

    return income
  }
}

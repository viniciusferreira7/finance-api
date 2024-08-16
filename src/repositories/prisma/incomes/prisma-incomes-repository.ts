import { Income, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'
import { prisma } from '@/lib/prisma'

import { IncomesRepository } from '../../incomes-repository'

interface getMetricsMonthlyParams {
  userId: string
  dates: {
    lastMonth: string
    startOfLastMonth: string
  }
}

interface UpdateIncome {
  id: string
  name?: string
  value?: string
  description?: string
  categoryId?: string
}

export class PrismaIncomesRepository implements IncomesRepository {
  async getMetricsMonthly({
    userId,
    dates: { lastMonth, startOfLastMonth },
  }: getMetricsMonthlyParams): Promise<{
    amount: number
    diff_from_last_month: number
  }> {
    const [metrics] = await prisma.$queryRaw<
      { amount: number; diff_from_last_month: number }[]
    >`
    WITH current_month AS (
      SELECT 
        SUM(value) AS total 
      FROM incomes 
      WHERE 
        user_id = ${userId} AND 
        created_at >= ${startOfLastMonth}::date AND 
        created_at < (${startOfLastMonth}::date + interval '1 month')
    ), last_month AS (
      SELECT 
        SUM(value) AS total 
      FROM incomes 
      WHERE 
        user_id = ${userId} AND 
        created_at >= ${lastMonth}::date AND 
        created_at < (${lastMonth}::date + interval '1 month')
    )
    SELECT 
      COALESCE(current_month.total, 0) AS amount, 
      COALESCE(current_month.total, 0) - COALESCE(last_month.total, 0) AS diff_from_last_month 
    FROM 
      current_month, last_month;
  `

    return metrics
  }

  async findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<Income>> {
    const isToGetCreatedAtOneDate =
      searchParams.createdAt?.from && !searchParams.createdAt?.to

    const isToGetUpdatedAtOneDate =
      searchParams.updatedAt?.from && !searchParams.updatedAt?.to

    const count = await prisma.income.count({
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
      const incomes = await prisma.income.findMany({
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
        results: incomes,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const incomesPaginated = await prisma.income.findMany({
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
      results: incomesPaginated,
    }
  }

  async findById(id: string) {
    const income = await prisma.income.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    return income
  }

  async delete(id: string) {
    const income = await prisma.income.delete({
      where: {
        id,
      },
    })

    return income
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

  async update(updateIncome: UpdateIncome) {
    const prismaIncome = await prisma.income.update({
      where: {
        id: updateIncome.id,
      },
      data: {
        name: updateIncome.name,
        value: updateIncome.value,
        description: updateIncome.description,
        updated_at: new Date(),
        category_id: updateIncome.categoryId,
      },
    })

    return prismaIncome
  }

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income = await prisma.income.create({
      data,
    })
    return income
  }
}

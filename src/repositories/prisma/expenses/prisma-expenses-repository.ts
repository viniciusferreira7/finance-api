import { Expense, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'
import { prisma } from '@/lib/prisma'

import { ExpensesRepository } from '../../expenses-repository'

interface getMetricsMonthlyParams {
  userId: string
  dates: {
    lastMonth: Date
    startOfLastMonth: Date
  }
}

interface UpdateExpense {
  id: string
  name?: string
  value?: string
  description?: string | null
  categoryId?: string
}

export class PrismaExpensesRepository implements ExpensesRepository {
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
      SUM(CAST(value AS numeric)) AS total 
    FROM expenses 
    WHERE 
      user_id = ${userId} AND 
      created_at >= ${startOfLastMonth} AND 
      created_at < (${startOfLastMonth} + interval '1 month')
  ), last_month AS (
    SELECT 
      SUM(CAST(value AS numeric)) AS total 
    FROM expenses 
    WHERE 
      user_id = ${userId} AND 
      created_at >= ${lastMonth} AND 
      created_at < (${lastMonth} + interval '1 month')
  )
  SELECT 
    COALESCE(current_month.total, 0) AS amount, 
    (COALESCE(current_month.total, 0) * 100) / COALESCE(last_month.total, 0) AS diff_from_last_month 
  FROM 
    current_month, last_month;
`

    return metrics
  }

  async findManyByUserId(
    userId: string,
    searchParams: Partial<SearchParams>,
  ): Promise<PaginationResponse<Expense>> {
    const isToGetCreatedAtOneDate =
      searchParams.createdAt?.from && !searchParams.createdAt?.to

    const isToGetUpdatedAtOneDate =
      searchParams.updatedAt?.from && !searchParams.updatedAt?.to

    const count = await prisma.expense.count({
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
      const expenses = await prisma.expense.findMany({
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
        results: expenses,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const expensesPaginated = await prisma.expense.findMany({
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
      results: expensesPaginated,
    }
  }

  async findById(id: string) {
    const expense = await prisma.expense.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })

    return expense
  }

  async delete(id: string) {
    const expense = await prisma.expense.delete({
      where: {
        id,
      },
    })

    return expense
  }

  async updateManyByCategoryId(categoryId: string) {
    const { count } = await prisma.expense.updateMany({
      where: {
        category_id: categoryId,
      },
      data: {
        category_id: undefined,
      },
    })

    return count
  }

  async update(updateExpense: UpdateExpense) {
    const prismaExpense = await prisma.expense.update({
      where: {
        id: updateExpense.id,
      },
      data: {
        name: updateExpense.name,
        value: updateExpense.value,
        description: updateExpense.description,
        updated_at: new Date(),
        category_id: updateExpense.categoryId,
      },
    })

    return prismaExpense
  }

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense = await prisma.expense.create({
      data,
    })
    return expense
  }
}

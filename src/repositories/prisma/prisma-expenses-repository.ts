import { Prisma } from '@prisma/client'

import { PaginationRequest } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'

import { ExpensesRepository } from '../expenses-repository'

export class PrismaExpensesRepository implements ExpensesRepository {
  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = await prisma.expense.count({
      where: {
        user_id: userId,
      },
    })

    if (pagination.pagination_disabled) {
      const expenses = await prisma.expense.findMany({
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
        results: expenses,
      }
    }

    const perPage = pagination?.per_page ?? 10
    const currentPage = pagination?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const expensesPaginated = await prisma.expense.findMany({
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
      results: expensesPaginated,
    }
  }

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense = await prisma.expense.create({
      data,
    })
    return expense
  }
}

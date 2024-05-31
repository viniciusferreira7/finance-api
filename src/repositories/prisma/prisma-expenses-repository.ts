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

    const totalPages = Math.ceil(count / pagination.per_page)

    const expenses = await prisma.expense.findMany({
      where: {
        user_id: userId,
      },
    })

    const nextPage = totalPages === pagination.page ? null : pagination.page + 1
    const previousPage = pagination.page === 1 ? null : pagination.page - 1

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: pagination.page,
      total_pages: totalPages,
      per_page: pagination.per_page,
      results: expenses,
    }
  }

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense = await prisma.expense.create({
      data,
    })
    return expense
  }
}

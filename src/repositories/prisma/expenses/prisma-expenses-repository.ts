import { Prisma } from '@prisma/client'

import { PaginationRequest } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'

import { ExpensesRepository } from '../../expenses-repository'

interface UpdateExpense {
  id: string
  name?: string
  value?: number
  description?: string | null
  categoryId?: string
}

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
        include: {
          category: true,
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

  async findById(id: string) {
    const expense = await prisma.expense.findUnique({
      where: {
        id,
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

  async update(updateExpense: UpdateExpense) {
    const prismaExpense = await prisma.expense.update({
      where: {
        id: updateExpense.id,
      },
      data: {
        name: updateExpense.name,
        value: updateExpense.value,
        description: updateExpense.description,
        update_at: new Date(),
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

import { Expense, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagination'

import { ExpensesRepository } from '../expenses-repository'

export class InMemoryExpensesRepository implements ExpensesRepository {
  public expense: Expense[] = []

  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = this.expense.length

    const totalPages = Math.ceil(count / pagination.per_page)

    const expenses = this.expense
      .filter((item) => item.user_id === userId)
      .slice(
        (pagination.page - 1) * pagination.per_page,
        pagination.page * pagination.per_page,
      )

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

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const expense: Expense = {
      id: randomUUID(),
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
    }

    this.expense.push(expense)

    return expense
  }
}

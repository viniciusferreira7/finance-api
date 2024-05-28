import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagintation'

import { IncomesRepository } from '../incomes.repository'

export class InMemoryIncomesRepository implements IncomesRepository {
  public incomes: Income[] = []

  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = this.incomes.filter(
      (income) => income.user_id === userId,
    ).length

    const totalPages = Math.ceil(count / pagination.per_page)

    const nextPage = totalPages === pagination.page ? null : pagination.page + 1
    const previousPage = pagination.page === 1 ? null : pagination.page - 1

    const incomes = this.incomes
      .filter((income) => income.user_id === userId)
      .slice(
        (pagination.page - 1) * pagination.per_page,
        pagination.page * pagination.per_page,
      )

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: pagination.page,
      total_pages: totalPages,
      per_page: pagination.per_page,
      results: incomes,
    }
  }

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income: Income = {
      id: randomUUID(),
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
    }

    this.incomes.push(income)

    return income
  }
}

import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagination'

import { IncomesRepository } from '../incomes.repository'

export class InMemoryIncomesRepository implements IncomesRepository {
  public incomes: Income[] = []

  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = this.incomes.filter(
      (income) => income.user_id === userId,
    ).length

    const incomes = this.incomes.filter((income) => income.user_id === userId)

    if (pagination.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        total_pages: 1,
        per_page: pagination.per_page,
        pagination_disabled: !!pagination.pagination_disabled,
        results: incomes,
      }
    }
    const totalPages = Math.ceil(count / pagination.per_page)

    const nextPage = totalPages === pagination.page ? null : pagination.page + 1
    const previousPage = pagination.page === 1 ? null : pagination.page - 1

    const incomesPaginated = this.incomes
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
      pagination_disabled: !!pagination.pagination_disabled,
      results: incomesPaginated,
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

import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagination'

import { IncomesRepository } from '../incomes-repository'

interface UpdateIncome {
  id: string
  value?: number
  description?: string
  categoryId?: string
}

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
        per_page: count,
        pagination_disabled: !!pagination.pagination_disabled,
        results: incomes,
      }
    }
    const perPage = pagination?.per_page ?? 10
    const currentPage = pagination?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    const incomesPaginated = this.incomes
      .filter((income) => income.user_id === userId)
      .slice((currentPage - 1) * perPage, currentPage * perPage)

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      total_pages: totalPages,
      per_page: perPage,
      pagination_disabled: !!pagination.pagination_disabled,
      results: incomesPaginated,
    }
  }

  async findById(id: string) {
    const income = this.incomes.find((item) => item.id === id)

    if (!income) {
      return null
    }

    return income
  }

  async delete(id: string) {
    const incomeIndex = this.incomes.findIndex((item) => item.id === id)

    if (incomeIndex >= 0) {
      const deletedIncome = this.incomes[incomeIndex]

      this.incomes.splice(incomeIndex, 1)

      return deletedIncome
    }

    return null
  }

  async update(updateIncome: UpdateIncome) {
    const incomeIndex = this.incomes.findIndex(
      (item) => item.id === updateIncome.id,
    )

    if (incomeIndex >= 0) {
      let income = this.incomes[incomeIndex]

      income = {
        ...income,
        value: updateIncome?.value ?? income.value,
        description: updateIncome?.description ?? income.description,
        update_at: new Date(),
        category_id: updateIncome?.categoryId ?? income.category_id,
      }

      this.incomes.splice(incomeIndex, 1, income)

      return income
    }

    return null
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

import { Expense, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PaginationRequest } from '@/@types/pagination'

import { ExpensesRepository } from '../../expenses-repository'

interface UpdateExpense {
  id: string
  name?: string
  value?: number
  description?: string | null
  categoryId?: string
}

export class InMemoryExpensesRepository implements ExpensesRepository {
  public expenses: Expense[] = []

  async findManyByUserId(userId: string, pagination: PaginationRequest) {
    const count = this.expenses.length

    const expenses = this.expenses.filter((item) => item.user_id === userId)

    if (pagination.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
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

    const expensesPaginated = this.expenses
      .filter((item) => item.user_id === userId)
      .slice((currentPage - 1) * perPage, currentPage * perPage)

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
    const expense = this.expenses.find((item) => item.id === id)

    if (!expense) {
      return null
    }

    return expense
  }

  async delete(id: string) {
    const expenseIndex = this.expenses.findIndex((item) => item.id === id)

    if (expenseIndex >= 0) {
      const deletedExpenses = this.expenses[expenseIndex]

      this.expenses.splice(expenseIndex, 1)

      return deletedExpenses
    }

    return null
  }

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.expenses
      .filter((expense) => expense.category_id === categoryId)
      .map((expense) => {
        return { ...expense, category_id: '' }
      })

    const differentCategoryId = this.expenses.filter(
      (expense) => expense.category_id !== categoryId,
    )

    this.expenses = []

    this.expenses.push(...differentCategoryId)
    this.expenses.push(...sameCategoryId)

    return sameCategoryId.length
  }

  async update(updateExpense: UpdateExpense) {
    const expenseIndex = this.expenses.findIndex(
      (item) => item.id === updateExpense.id,
    )

    if (expenseIndex >= 0) {
      let expense = this.expenses[expenseIndex]

      expense = {
        ...expense,
        name: updateExpense.name ?? expense.name,
        value: updateExpense?.value ?? expense.value,
        description: updateExpense?.description ?? expense.description,
        update_at: new Date(),
        category_id: updateExpense?.categoryId ?? expense.category_id,
      }

      this.expenses.splice(expenseIndex, 1, expense)

      return expense
    }

    return null
  }

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense: Expense = {
      id: randomUUID(),
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
    }

    this.expenses.push(expense)

    return expense
  }
}

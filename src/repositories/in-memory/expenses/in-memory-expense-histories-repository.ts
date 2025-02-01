import { ExpenseHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { SearchParams } from '@/interfaces/search-params'
import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { compareDates } from '@/utils/compare-dates'

export class InMemoryExpenseHistoriesRepository
  implements ExpenseHistoriesRepository
{
  public expenseHistories: ExpenseHistory[] = []

  async findManyByUserId(
    userId: string,
    expenseId: string,
    searchParams: Partial<SearchParams>,
  ) {
    const expenseHistories = this.expenseHistories.filter((expense) => {
      return expense.user_id === userId && expense.expense_id === expenseId
    })

    const expensesFiltered = expenseHistories
      .filter((expense) => {
        const createdAt = compareDates({
          date: expense.created_at,
          from: searchParams?.createdAt?.from,
          to: searchParams?.createdAt?.to,
        })

        const name = searchParams.name
          ? expense.name.includes(searchParams?.name)
          : true

        const value = searchParams.value
          ? expense.value === searchParams?.value
          : true

        const categoryId = searchParams.categoryId
          ? searchParams?.categoryId === expense.category_id
          : true

        return (
          expense.user_id === userId && createdAt && name && categoryId && value
        )
      })
      .sort((a, b) => {
        if (searchParams.sort === 'asc') {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      })

    const count = expensesFiltered.length

    if (searchParams.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        total_pages: 1,
        per_page: count,
        pagination_disabled: !!searchParams.pagination_disabled,
        results: expensesFiltered,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(expensesFiltered.length / perPage)

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    const expensesPaginated = expensesFiltered.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage,
    )

    return {
      count: expensesFiltered.length,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      total_pages: totalPages,
      per_page: perPage,
      pagination_disabled: !!searchParams.pagination_disabled,
      results: expensesPaginated,
    }
  }

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.expenseHistories
      .filter((expense) => expense.category_id === categoryId)
      .map((expense) => {
        return { ...expense, category_id: '' }
      })

    const differentCategoryId = this.expenseHistories.filter(
      (expense) => expense.category_id !== categoryId,
    )

    this.expenseHistories = []

    this.expenseHistories.push(...differentCategoryId)
    this.expenseHistories.push(...sameCategoryId)

    return sameCategoryId.length
  }

  async deleteMany(expenseId: string, userId: string) {
    const deletedExpense = this.expenseHistories.filter((expense) => {
      return expense.expense_id === expenseId && expense.user_id === userId
    })

    const notDeletedExpense = this.expenseHistories.filter((expense) => {
      return expense.expense_id !== expenseId && expense.user_id !== userId
    })

    this.expenseHistories = notDeletedExpense

    return deletedExpense.length
  }

  async create(data: Prisma.ExpenseHistoryUncheckedCreateInput) {
    const expense: ExpenseHistory = {
      id: randomUUID(),
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id ?? null,
      expense_id: data.expense_id,
    }

    this.expenseHistories.push(expense)

    return expense
  }
}

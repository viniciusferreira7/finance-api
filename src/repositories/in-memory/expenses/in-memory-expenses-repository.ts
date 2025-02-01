import { Expense, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

import { SearchParams } from '@/interfaces/search-params'
import { compareDates } from '@/utils/compare-dates'

import { ExpensesRepository } from '../../expenses-repository'

interface GetMetricsMonthly {
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

export class InMemoryExpensesRepository implements ExpensesRepository {
  public expenses: Expense[] = []

  async getMetricsMonthly({ userId, dates }: GetMetricsMonthly) {
    const expenseFromLastMonth = this.expenses.filter((expense) => {
      const lastMonth = dayjs(expense.created_at).format('YYYY-MM')

      return (
        expense.user_id === userId &&
        lastMonth === dayjs(dates.lastMonth).format('YYYY-MM')
      )
    })

    const expenseFromCurrentMonth = this.expenses.filter((expense) => {
      const currentMonth = dayjs().format('YYYY-MM')

      return (
        expense.user_id === userId &&
        currentMonth === dayjs(expense.created_at).format('YYYY-MM')
      )
    })

    const amountFromLastMonth = expenseFromLastMonth.reduce(
      (amount, expense) => {
        return amount + Number(expense.value)
      },
      0,
    )

    const amountFromCurrentMonth = expenseFromCurrentMonth.reduce(
      (amount, expense) => {
        return amount + Number(expense.value)
      },
      0,
    )

    const differenceBetweenMonths =
      amountFromLastMonth > 0
        ? (amountFromCurrentMonth * 100) / amountFromLastMonth
        : 0

    return {
      amount: amountFromLastMonth + amountFromCurrentMonth,
      diff_from_last_month: differenceBetweenMonths,
    }
  }

  async findManyByUserId(userId: string, searchParams: Partial<SearchParams>) {
    const expenses = this.expenses.filter(
      (expense) => expense.user_id === userId,
    )

    const expensesFiltered = expenses
      .filter((expense) => {
        const createdAt = compareDates({
          date: expense.created_at,
          from: searchParams?.createdAt?.from,
          to: searchParams?.createdAt?.to,
        })

        const updatedAt = compareDates({
          date: expense.updated_at,
          from: searchParams?.updatedAt?.from,
          to: searchParams?.updatedAt?.to,
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

        return createdAt && updatedAt && name && categoryId && value
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
        updated_at: new Date(),
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
      updated_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id ?? null,
    }

    this.expenses.push(expense)

    return expense
  }
}

import { IncomeHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { SearchParams } from '@/interfaces/search-params'
import { compareDates } from '@/utils/compare-dates'

import { IncomeHistoriesRepository } from '../../income-histories-repository'

export class InMemoryIncomeHistoriesRepository
  implements IncomeHistoriesRepository
{
  public incomeHistories: IncomeHistory[] = []

  async findManyByUserId(
    userId: string,
    incomeId: string,
    searchParams: Partial<SearchParams>,
  ) {
    const incomeHistories = this.incomeHistories.filter((income) => {
      return income.user_id === userId && income.income_id === incomeId
    })

    const incomesFiltered = incomeHistories
      .filter((income) => {
        const createdAt = compareDates({
          date: income.created_at,
          from: searchParams?.createdAt?.from,
          to: searchParams?.createdAt?.to,
        })

        const name = searchParams.name
          ? income.name.includes(searchParams?.name)
          : true

        const value = searchParams.value
          ? income.value === searchParams?.value
          : true

        const categoryId = searchParams.categoryId
          ? searchParams?.categoryId === income.category_id
          : true

        return (
          income.user_id === userId && createdAt && name && categoryId && value
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

    const count = incomesFiltered.length

    if (searchParams.pagination_disabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        total_pages: 1,
        per_page: count,
        pagination_disabled: !!searchParams.pagination_disabled,
        results: incomesFiltered,
      }
    }

    const perPage = searchParams?.per_page ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(incomesFiltered.length / perPage)

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    const incomesPaginated = incomesFiltered.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage,
    )

    return {
      count: incomesFiltered.length,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      total_pages: totalPages,
      per_page: perPage,
      pagination_disabled: !!searchParams.pagination_disabled,
      results: incomesPaginated,
    }
  }

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.incomeHistories
      .filter((income) => income.category_id === categoryId)
      .map((income) => {
        return { ...income, category_id: '' }
      })

    const differentCategoryId = this.incomeHistories.filter(
      (income) => income.category_id !== categoryId,
    )

    this.incomeHistories = []

    this.incomeHistories.push(...differentCategoryId)
    this.incomeHistories.push(...sameCategoryId)

    return sameCategoryId.length
  }

  async deleteMany(incomeId: string, userId: string) {
    const deletedIncomes = this.incomeHistories.filter((income) => {
      return income.income_id === incomeId && income.user_id === userId
    })

    const notDeletedIncomes = this.incomeHistories.filter((income) => {
      return income.income_id !== incomeId && income.user_id !== userId
    })

    this.incomeHistories = notDeletedIncomes

    return deletedIncomes.length
  }

  async create(data: Prisma.IncomeHistoryUncheckedCreateInput) {
    const income: IncomeHistory = {
      id: randomUUID(),
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id ?? null,
      income_id: data.income_id,
    }

    this.incomeHistories.push(income)

    return income
  }
}

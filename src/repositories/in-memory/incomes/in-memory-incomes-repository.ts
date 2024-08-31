import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

import { SearchParams } from '@/@types/search-params'

import { compareDates } from '../../../utils/compare-dates'
import { IncomesRepository } from '../../incomes-repository'

interface GetMetricsMonthly {
  userId: string
  dates: {
    lastMonth: Date
    startOfLastMonth: Date
  }
}

interface UpdateIncome {
  id: string
  name?: string
  value?: string
  description?: string | null
  categoryId?: string
}

export class InMemoryIncomesRepository implements IncomesRepository {
  public incomes: Income[] = []

  async getMetricsMonthly({ userId, dates }: GetMetricsMonthly) {
    const incomeFromLastMonth = this.incomes.filter((income) => {
      const lastMonth = dayjs(income.created_at).format('YYYY-MM')

      return (
        income.user_id === userId &&
        lastMonth === dayjs(dates.lastMonth).format('YYYY-MM')
      )
    })

    const incomeFromCurrentMonth = this.incomes.filter((income) => {
      const currentMonth = dayjs().format('YYYY-MM')

      return (
        income.user_id === userId &&
        currentMonth === dayjs(income.created_at).format('YYYY-MM')
      )
    })

    const amountFromLastMonth = incomeFromLastMonth.reduce((amount, income) => {
      return amount + Number(income.value)
    }, 0)

    const amountFromCurrentMonth = incomeFromCurrentMonth.reduce(
      (amount, income) => {
        return amount + Number(income.value)
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
    const incomes = this.incomes.filter((income) => income.user_id === userId)

    const incomesFiltered = incomes
      .filter((income) => {
        const createdAt = compareDates({
          date: income.created_at,
          from: searchParams?.createdAt?.from,
          to: searchParams?.createdAt?.to,
        })

        const updatedAt = compareDates({
          date: income.updated_at,
          from: searchParams?.updatedAt?.from,
          to: searchParams?.updatedAt?.to,
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
          income.user_id === userId &&
          createdAt &&
          updatedAt &&
          name &&
          categoryId &&
          value
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

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.incomes
      .filter((income) => income.category_id === categoryId)
      .map((income) => {
        return { ...income, category_id: '' }
      })

    const differentCategoryId = this.incomes.filter(
      (income) => income.category_id !== categoryId,
    )

    this.incomes = []

    this.incomes.push(...differentCategoryId)
    this.incomes.push(...sameCategoryId)

    return sameCategoryId.length
  }

  async update(updateIncome: UpdateIncome) {
    const incomeIndex = this.incomes.findIndex(
      (item) => item.id === updateIncome.id,
    )

    if (incomeIndex >= 0) {
      let income = this.incomes[incomeIndex]

      income = {
        ...income,
        name: updateIncome?.name ?? income.name,
        value: updateIncome?.value ?? income.value,
        description: updateIncome?.description ?? income.description,
        updated_at: new Date(),
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
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id ?? null,
    }

    this.incomes.push(income)

    return income
  }
}

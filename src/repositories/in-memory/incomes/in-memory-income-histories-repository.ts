import { IncomeHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { IncomeHistoriesRepository } from '../../income-histories-repository'

export class InMemoryIncomeHistoriesRepository
  implements IncomeHistoriesRepository
{
  public incomeHistoriesRepository: IncomeHistory[] = []

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.incomeHistoriesRepository
      .filter((income) => income.category_id === categoryId)
      .map((income) => {
        return { ...income, category_id: '' }
      })

    const differentCategoryId = this.incomeHistoriesRepository.filter(
      (income) => income.category_id !== categoryId,
    )

    this.incomeHistoriesRepository = []

    this.incomeHistoriesRepository.push(...differentCategoryId)
    this.incomeHistoriesRepository.push(...sameCategoryId)

    return sameCategoryId.length
  }

  async deleteMany(incomeId: string, userId: string) {
    const deletedIncomes = this.incomeHistoriesRepository.filter((income) => {
      return income.income_id === incomeId && income.user_id === userId
    })

    const notDeletedIncomes = this.incomeHistoriesRepository.filter(
      (income) => {
        return income.income_id !== incomeId && income.user_id !== userId
      },
    )

    this.incomeHistoriesRepository = notDeletedIncomes

    return deletedIncomes.length
  }

  async create(data: Prisma.IncomeHistoryUncheckedCreateInput) {
    const income: IncomeHistory = {
      id: randomUUID(),
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
      income_id: data.income_id,
    }

    this.incomeHistoriesRepository.push(income)

    return income
  }
}

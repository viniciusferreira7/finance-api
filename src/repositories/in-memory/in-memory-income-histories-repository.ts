import { IncomeHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { IncomeHistories } from '../income-histories-repository'

export class InMemoryIncomeHistoriesRepository implements IncomeHistories {
  public incomeHistories: IncomeHistory[] = []

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
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
      income_id: data.income_id,
    }

    this.incomeHistories.push(income)

    return income
  }
}

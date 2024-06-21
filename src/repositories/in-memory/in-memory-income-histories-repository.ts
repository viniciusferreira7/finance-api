import { IncomeHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { IncomeHistoriesRepository } from '../income-histories-repository'

export class InMemoryIncomeHistoriesRepository
  // eslint-disable-next-line prettier/prettier
  implements IncomeHistoriesRepository {
  public incomeHistoriesRepository: IncomeHistory[] = []

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
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
      income_id: data.income_id,
    }

    this.incomeHistoriesRepository.push(income)

    return income
  }
}

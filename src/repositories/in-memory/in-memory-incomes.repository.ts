import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { IncomeRepository } from '../incomes.repository'

export class InMemoryIncomesRepository implements IncomeRepository {
  public incomes: Income[] = []

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income = {
      id: randomUUID(),
      value: data.value,
      description: data.description,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
    }

    this.incomes.push(income)

    return income
  }
}

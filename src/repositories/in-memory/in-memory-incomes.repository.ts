import { Income, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { IncomesRepository } from '../incomes.repository'

export class InMemoryIncomesRepository implements IncomesRepository {
  public incomes: Income[] = []

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

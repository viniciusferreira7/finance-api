import { Expense, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ExpensesRepository } from '../expenses-repository'

export class InMemoryExpenseRepository implements ExpensesRepository {
  public expense: Expense[] = []

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const expense: Expense = {
      id: randomUUID(),
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
    }

    this.expense.push(expense)

    return expense
  }
}

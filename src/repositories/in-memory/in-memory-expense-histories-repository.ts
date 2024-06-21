import { ExpenseHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ExpenseHistoriesRepository } from '../expense-histories-repository'

export class InMemoryExpenseHistoriesRepository
  // eslint-disable-next-line prettier/prettier
  implements ExpenseHistoriesRepository {
  public expenseHistoriesRepository: ExpenseHistory[] = []

  async deleteMany(expenseId: string, userId: string) {
    const deletedExpense = this.expenseHistoriesRepository.filter((expense) => {
      return expense.expense_id === expenseId && expense.user_id === userId
    })

    const notDeletedExpense = this.expenseHistoriesRepository.filter(
      (expense) => {
        return expense.expense_id !== expenseId && expense.user_id !== userId
      },
    )

    this.expenseHistoriesRepository = notDeletedExpense

    return deletedExpense.length
  }

  async create(data: Prisma.ExpenseHistoryUncheckedCreateInput) {
    const expense: ExpenseHistory = {
      id: randomUUID(),
      name: data.name,
      value: data.value,
      description: data.description ?? null,
      created_at: new Date(),
      update_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
      expense_id: data.expense_id,
    }

    this.expenseHistoriesRepository.push(expense)

    return expense
  }
}

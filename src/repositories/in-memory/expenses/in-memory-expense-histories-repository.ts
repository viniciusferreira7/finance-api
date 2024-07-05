import { ExpenseHistory, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'

export class InMemoryExpenseHistoriesRepository
  implements ExpenseHistoriesRepository
{
  public expenseHistoriesRepository: ExpenseHistory[] = []

  async updateManyByCategoryId(categoryId: string) {
    const sameCategoryId = this.expenseHistoriesRepository
      .filter((expense) => expense.category_id === categoryId)
      .map((expense) => {
        return { ...expense, category_id: '' }
      })

    const differentCategoryId = this.expenseHistoriesRepository.filter(
      (expense) => expense.category_id !== categoryId,
    )

    this.expenseHistoriesRepository = []

    this.expenseHistoriesRepository.push(...differentCategoryId)
    this.expenseHistoriesRepository.push(...sameCategoryId)

    return sameCategoryId.length
  }

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
      updated_at: new Date(),
      user_id: data.user_id,
      category_id: data.category_id,
      expense_id: data.expense_id,
    }

    this.expenseHistoriesRepository.push(expense)

    return expense
  }
}

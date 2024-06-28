import { Expense } from '@prisma/client'

import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface DeleteUserExpenseRequest {
  userId: string
  expenseId: string
}

interface DeleteUserExpenseResponse {
  expense: Expense | null
}

export class DeleteUserExpense {
  constructor(
    private expensesRepository: ExpensesRepository,
    private expenseHistoriesRepository: ExpenseHistoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    expenseId,
  }: DeleteUserExpenseRequest): Promise<DeleteUserExpenseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const expense = await this.expensesRepository.findById(expenseId)

    if (!expense) {
      throw new ResourceNotFound()
    }

    const deletedExpense = await this.expensesRepository.delete(expenseId)

    await this.expenseHistoriesRepository.deleteMany(expenseId, userId)

    return { expense: deletedExpense }
  }
}

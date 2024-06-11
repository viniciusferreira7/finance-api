import { Expense } from '@prisma/client'

import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

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
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

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

    const deletedExpense =
      await this.expensesRepository.deleteExpense(expenseId)

    return { expense: deletedExpense }
  }
}

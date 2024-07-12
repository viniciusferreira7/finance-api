import { Expense } from '@prisma/client'

import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetUserExpenseUseCaseRequest {
  userId: string
  expenseId: string
}

interface GetUserExpenseUseCaseResponse {
  expense: Expense | null
}

export class GetUserExpenseUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    expenseId,
  }: GetUserExpenseUseCaseRequest): Promise<GetUserExpenseUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const expense = await this.expensesRepository.findById(expenseId)

    if (!expense) {
      throw new ResourceNotFound()
    }

    return { expense }
  }
}

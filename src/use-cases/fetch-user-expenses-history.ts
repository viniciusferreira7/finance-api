import { Expense } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface FetchUserExpensesHistoryUseCaseRequest extends PaginationRequest {
  userId: string
}

type FetchUserExpensesHistoryUseCaseResponse = PaginationResponse<Expense>

export class FetchUserExpensesHistoryUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    page,
    per_page,
  }: FetchUserExpensesHistoryUseCaseRequest): Promise<FetchUserExpensesHistoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.expensesRepository.findManyByUserId(userId, {
      page,
      per_page,
    })

    return { ...results }
  }
}

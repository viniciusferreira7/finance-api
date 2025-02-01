import { Expense } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'
import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserExpenseHistoriesUseCaseRequest {
  userId: string
  expenseId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserExpenseHistoriesUseCaseResponse = PaginationResponse<Expense>

export class FetchUserExpenseHistoriesUseCase {
  constructor(
    private expenseHistoriesRepository: ExpenseHistoriesRepository,
    private expensesRepository: ExpensesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    expenseId,
    userId,
    searchParams,
  }: FetchUserExpenseHistoriesUseCaseRequest): Promise<FetchUserExpenseHistoriesUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const expense = await this.expensesRepository.findById(expenseId)

    if (!expense) {
      throw new ResourceNotFound()
    }

    const results = await this.expenseHistoriesRepository.findManyByUserId(
      userId,
      expenseId,
      {
        page: searchParams?.page,
        per_page: searchParams?.per_page,
        pagination_disabled: searchParams?.pagination_disabled,
        categoryId: searchParams?.categoryId,
        name: searchParams?.name,
        value: searchParams?.value,
        sort: searchParams?.sort,
        createdAt: searchParams?.createdAt,
        updatedAt: searchParams?.updatedAt,
      },
    )

    return { ...results }
  }
}

import { Expense } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'
import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserExpenseHistoriesUseCaseRequest {
  expenseId: string
  userId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserExpenseHistoriesUseCaseResponse = PaginationResponse<Expense>

export class FetchUserExpenseHistoriesUseCase {
  constructor(
    private expenseHistoriesRepository: ExpenseHistoriesRepository,
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

    const results = await this.expenseHistoriesRepository.findManyByUserId(
      expenseId,
      userId,
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

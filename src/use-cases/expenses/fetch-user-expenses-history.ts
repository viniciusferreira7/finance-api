import { Expense } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserExpensesHistoryUseCaseRequest {
  userId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserExpensesHistoryUseCaseResponse = PaginationResponse<Expense>

export class FetchUserExpensesHistoryUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    searchParams,
  }: FetchUserExpensesHistoryUseCaseRequest): Promise<FetchUserExpensesHistoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.expensesRepository.findManyByUserId(userId, {
      page: searchParams?.page,
      per_page: searchParams?.per_page,
      pagination_disabled: searchParams?.pagination_disabled,
      categoryId: searchParams?.categoryId,
      name: searchParams?.name,
      value: searchParams?.value,
      sort: searchParams?.sort,
      createdAt: searchParams?.createdAt,
      updatedAt: searchParams?.updatedAt,
    })

    return { ...results }
  }
}

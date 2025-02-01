import { Income } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserIncomesHistoryUseCaseRequest {
  userId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserIncomesHistoryUseCaseResponse = PaginationResponse<Income>

export class FetchUserIncomesHistoryUseCase {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    searchParams,
  }: FetchUserIncomesHistoryUseCaseRequest): Promise<FetchUserIncomesHistoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.incomesRepository.findManyByUserId(userId, {
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

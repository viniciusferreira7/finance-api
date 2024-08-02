import { IncomeHistory } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { SearchParams } from '@/@types/search-params'
import { IncomeHistoriesRepository } from '@/repositories/income-histories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserIncomesHistoriesUseCaseRequest {
  userId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserIncomesHistoriesUseCaseResponse =
  PaginationResponse<IncomeHistory>

export class FetchUserIncomesHistoriesUseCase {
  constructor(
    private incomeHistoriesRepository: IncomeHistoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    searchParams,
  }: FetchUserIncomesHistoriesUseCaseRequest): Promise<FetchUserIncomesHistoriesUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.incomeHistoriesRepository.findManyByUserId(
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

import { IncomeHistory } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import { SearchParams } from '@/interfaces/search-params'
import { IncomeHistoriesRepository } from '@/repositories/income-histories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserIncomesHistoriesUseCaseRequest {
  userId: string
  incomeId: string
  searchParams?: Partial<SearchParams>
}

type FetchUserIncomesHistoriesUseCaseResponse =
  PaginationResponse<IncomeHistory>

export class FetchUserIncomesHistoriesUseCase {
  constructor(
    private incomeHistoriesRepository: IncomeHistoriesRepository,
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    incomeId,
    searchParams,
  }: FetchUserIncomesHistoriesUseCaseRequest): Promise<FetchUserIncomesHistoriesUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = await this.incomesRepository.findById(incomeId)

    if (!income) {
      throw new ResourceNotFound()
    }

    const results = await this.incomeHistoriesRepository.findManyByUserId(
      userId,
      incomeId,
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

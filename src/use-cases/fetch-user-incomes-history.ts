import { Income } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface FetchUserIncomesHistoryUseCaseRequest extends PaginationRequest {
  userId: string
}

type FetchUserIncomesHistoryUseCaseResponse = PaginationResponse<Income>

export class FetchUserIncomesHistoryUseCase {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    page,
    per_page,
    pagination_disabled,
  }: FetchUserIncomesHistoryUseCaseRequest): Promise<FetchUserIncomesHistoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.incomesRepository.findManyByUserId(userId, {
      page,
      per_page,
      pagination_disabled,
    })

    return { ...results }
  }
}

import { Income } from '@prisma/client'

import { IncomesRepository } from '@/repositories/incomes.repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface FetchUserIncomesHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserIncomesHistoryUseCaseResponse {
  incomes: Income[]
}

export class FetchUserIncomesHistoryUseCase {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    page,
  }: FetchUserIncomesHistoryUseCaseRequest): Promise<FetchUserIncomesHistoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const incomes = await this.incomesRepository.findManyByUserId(userId, page)

    return { incomes }
  }
}

import { Income } from '@prisma/client'

import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetUserIncomeUseCaseRequest {
  userId: string
  incomeId: string
}

interface GetUserIncomeUseCaseResponse {
  income: Income | null
}

export class GetUserIncomeUseCase {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    incomeId,
  }: GetUserIncomeUseCaseRequest): Promise<GetUserIncomeUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = await this.incomesRepository.findById(incomeId)

    if (!income) {
      throw new ResourceNotFound()
    }

    return { income }
  }
}

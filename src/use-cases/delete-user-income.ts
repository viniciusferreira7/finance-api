import { Income } from '@prisma/client'

import { IncomesRepository } from '@/repositories/incomes.repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface DeleteUserIncomesRequest {
  userId: string
  incomeId: string
}

interface DeleteUserIncomesResponse {
  income: Income
}

export class DeleteUserIncomes {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    incomeId,
  }: DeleteUserIncomesRequest): Promise<DeleteUserIncomesResponse> {
    const user = this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = this.incomesRepository.findById(incomeId)

    if (!income) {
      throw new ResourceNotFound()
    }

    const deletedIncome = await this.incomesRepository.deleteIncome(incomeId)

    return { income: deletedIncome }
  }
}

import { Income } from '@prisma/client'

import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface DeleteUserIncomeRequest {
  userId: string
  incomeId: string
}

interface DeleteUserIncomeResponse {
  income: Income | null
}

export class DeleteUserIncome {
  constructor(
    private incomesRepository: IncomesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    incomeId,
  }: DeleteUserIncomeRequest): Promise<DeleteUserIncomeResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = await this.incomesRepository.findById(incomeId)

    if (!income) {
      throw new ResourceNotFound()
    }

    const deletedIncome = await this.incomesRepository.deleteIncome(incomeId)

    return { income: deletedIncome }
  }
}
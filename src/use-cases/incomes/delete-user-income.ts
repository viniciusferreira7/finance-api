import { Income } from '@prisma/client'

import { IncomeHistoriesRepository } from '@/repositories/income-histories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

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
    private incomeHistoriesRepository: IncomeHistoriesRepository,
    private usersRepository: UsersRepository,
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

    const deletedIncome = await this.incomesRepository.delete(incomeId)

    await this.incomeHistoriesRepository.deleteMany(incomeId, userId)

    return { income: deletedIncome }
  }
}

import { BalanceRepository } from '@/repositories/balance'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface BalanceRequest {
  userId: string
}

interface BalanceResponse {
  incomes_total: number
  expenses_total: number
  balance_total: number
}

export class GetBalanceUseCase {
  constructor(
    private balanceRepository: BalanceRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: BalanceRequest): Promise<BalanceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const metrics = await this.balanceRepository.getBalance(user.id)

    return {
      incomes_total: metrics.incomes_total,
      expenses_total: metrics.expenses_total,
      balance_total: metrics.balance_total,
    }
  }
}

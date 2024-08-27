import { BalanceRepository } from '@/repositories/balance'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface BalanceRequest {
  userId: string
}

interface BalanceResponse {
  balance: number
}

export class BalanceUseCase {
  constructor(
    private balanceRepository: BalanceRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({ userId }: BalanceRequest): Promise<BalanceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const balance = await this.balanceRepository.getBalance(user.id)

    return {
      balance,
    }
  }
}

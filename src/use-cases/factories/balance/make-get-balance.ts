import { PrismaBalanceRepository } from '@/repositories/prisma/balance/prisma-balance-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetBalanceUseCase } from '@/use-cases/balance/get-balance'

export function makeGetBalance() {
  const balanceRepository = new PrismaBalanceRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetBalanceUseCase(balanceRepository, usersRepository)

  return useCase
}

import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetUserIncomeUseCase } from '@/use-cases/incomes/get-user-income'

export function makeGetUserIncome() {
  const incomesRepository = new PrismaIncomesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetUserIncomeUseCase(incomesRepository, usersRepository)

  return useCase
}

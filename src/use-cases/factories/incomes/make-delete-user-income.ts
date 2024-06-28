import { PrismaIncomeHistoriesRepository } from '@/repositories/prisma/prisma-income-histories-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DeleteUserIncome } from '../../delete-user-income'

export function makeDeleteUserIncome() {
  const incomesRepository = new PrismaIncomesRepository()
  const incomeHistoriesRepository = new PrismaIncomeHistoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserIncome(
    incomesRepository,
    incomeHistoriesRepository,
    usersRepository,
  )

  return useCase
}

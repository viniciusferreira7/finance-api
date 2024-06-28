import { PrismaIncomeHistoriesRepository } from '@/repositories/prisma/incomes/prisma-income-histories-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { DeleteUserIncome } from '../../incomes/delete-user-income'

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

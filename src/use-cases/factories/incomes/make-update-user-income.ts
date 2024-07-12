import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaIncomeHistoriesRepository } from '@/repositories/prisma/incomes/prisma-income-histories-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { UpdateUserIncomeUseCase } from '@/use-cases/incomes/update-user-income'

export function makeUpdateUserIncomeUseCase() {
  const incomesRepository = new PrismaIncomesRepository()
  const incomeHistoriesRepository = new PrismaIncomeHistoriesRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new UpdateUserIncomeUseCase(
    incomesRepository,
    incomeHistoriesRepository,
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

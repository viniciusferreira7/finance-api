import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories.repository'
import { PrismaExpenseHistoriesRepository } from '@/repositories/prisma/prisma-expense-histories-repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { CreateExpenseUseCase } from '../../create-expense'

export function makeCreateExpenseUseCase() {
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpenseHistoriesRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new CreateExpenseUseCase(
    expensesRepository,
    expenseHistoriesRepository,
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

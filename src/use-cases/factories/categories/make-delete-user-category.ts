import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaExpenseHistoriesRepository } from '@/repositories/prisma/expenses/prisma-expense-histories-repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaIncomeHistoriesRepository } from '@/repositories/prisma/incomes/prisma-income-histories-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { DeleteUserCategory } from '../../categories/delete-user-category'

export function makeDeleteUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const incomesRepository = new PrismaIncomesRepository()
  const incomeHistoriesRepository = new PrismaIncomeHistoriesRepository()
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpenseHistoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserCategory(
    categoriesRepository,
    incomesRepository,
    incomeHistoriesRepository,
    expensesRepository,
    expenseHistoriesRepository,
    usersRepository,
  )

  return useCase
}

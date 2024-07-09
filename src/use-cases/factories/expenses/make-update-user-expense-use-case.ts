import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaExpenseHistoriesRepository } from '@/repositories/prisma/expenses/prisma-expense-histories-repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { UpdateUserExpenseUseCase } from '@/use-cases/expenses/update-user-expense'

export function makeUpdateUserExpenseUseCase() {
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpenseHistoriesRepository()
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new UpdateUserExpenseUseCase(
    expensesRepository,
    expenseHistoriesRepository,
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

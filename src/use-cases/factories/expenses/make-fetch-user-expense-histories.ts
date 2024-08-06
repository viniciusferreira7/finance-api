import { PrismaExpenseHistoriesRepository } from '@/repositories/prisma/expenses/prisma-expense-histories-repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { FetchUserExpenseHistoriesUseCase } from '@/use-cases/expenses/fetch-user-expense-histories'

export function makeFetchUserExpenseHistories() {
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpenseHistoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserExpenseHistoriesUseCase(
    expenseHistoriesRepository,
    expensesRepository,
    usersRepository,
  )

  return useCase
}

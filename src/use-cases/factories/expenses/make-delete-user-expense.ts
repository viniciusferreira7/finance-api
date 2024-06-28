import { PrismaExpenseHistoriesRepository } from '@/repositories/prisma/expenses/prisma-expense-histories-repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { DeleteUserExpense } from '@/use-cases/expenses/delete-user-expense'

export function makeDeleteUserExpense() {
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpenseHistoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserExpense(
    expensesRepository,
    expenseHistoriesRepository,
    usersRepository,
  )

  return useCase
}

import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { DeleteUserExpense } from '@/use-cases/delete-user-expense'

export function makeDeleteUserExpense() {
  const expensesRepository = new PrismaExpensesRepository()
  const expenseHistoriesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserExpense(
    expensesRepository,
    expenseHistoriesRepository, // FIXME:
    usersRepository,
  )

  return useCase
}

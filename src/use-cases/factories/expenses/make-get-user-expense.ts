import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetUserExpenseUseCase } from '@/use-cases/expenses/get-user-expense'

export function makeGetUserExpense() {
  const expensesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetUserExpenseUseCase(expensesRepository, usersRepository)

  return useCase
}

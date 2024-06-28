import { PrismaExpensesRepository } from '@/repositories/prisma/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DeleteUserExpense } from '../delete-user-expense'

export function makeDeleteUserExpense() {
  const expensesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserExpense(expensesRepository, usersRepository)

  return useCase
}

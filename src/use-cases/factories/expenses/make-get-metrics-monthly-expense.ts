import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetMetricsMonthlyExpense } from '@/use-cases/expenses/get-metrics-monthly-expense'

export function makeGetMetricsMonthlyExpense() {
  const expensesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetMetricsMonthlyExpense(
    usersRepository,
    expensesRepository,
  )

  return useCase
}

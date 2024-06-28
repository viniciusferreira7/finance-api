import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaExpensesRepository } from '@/repositories/prisma/expenses/prisma-expenses-repository'
import { PrismaIncomesRepository } from '@/repositories/prisma/incomes/prisma-incomes.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { DeleteUserCategory } from '../../categories/delete-user-category'

export function makeDeleteUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const incomesRepository = new PrismaIncomesRepository()
  const expensesRepository = new PrismaExpensesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new DeleteUserCategory(
    categoriesRepository,
    incomesRepository,
    expensesRepository,
    usersRepository,
  )

  return useCase
}

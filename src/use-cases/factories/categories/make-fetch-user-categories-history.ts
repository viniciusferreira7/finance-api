import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { FetchUserCategoriesHistoryUseCase } from '../../fetch-user-categories-history'

export function makeFetchUserCategoriesHistory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchUserCategoriesHistoryUseCase(
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

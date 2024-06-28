import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { CreateCategoryUseCase } from '../../categories/create-category'

export function makeCreateCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreateCategoryUseCase(
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

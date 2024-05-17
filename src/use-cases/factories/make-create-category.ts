import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { CreateCategoryUseCase } from '../create-category'

export function makeCreateCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreateCategoryUseCase(
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

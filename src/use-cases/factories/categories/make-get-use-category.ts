import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { GetUserCategoryUseCase } from '@/use-cases/categories/get-user-category'

export function makeGetUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetUserCategoryUseCase(
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

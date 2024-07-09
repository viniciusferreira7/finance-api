import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'
import { UpdateUserCategoryUseCase } from '@/use-cases/categories/update-user-category'

export function makeUpdateUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new UpdateUserCategoryUseCase(
    categoriesRepository,
    usersRepository,
  )

  return useCase
}

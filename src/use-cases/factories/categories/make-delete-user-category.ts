import { PrismaCategoriesRepository } from '@/repositories/prisma/categories/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users/prisma-users-repository'

import { DeleteUserCategory } from '../../delete-user-category'

export function makeDeleteUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new DeleteUserCategory(categoriesRepository, usersRepository)

  return useCase
}

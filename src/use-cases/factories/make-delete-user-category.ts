import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories.repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { DeleteUserCategory } from '../delete-user-category'

export function makeDeleteUserCategory() {
  const categoriesRepository = new PrismaCategoriesRepository()
  const usersRepository = new PrismaUsersRepository()
  const useCase = new DeleteUserCategory(categoriesRepository, usersRepository)

  return useCase
}

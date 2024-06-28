import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface DeleteUserCategoryRequest {
  userId: string
  categoryId: string
}

interface DeleteUserCategoryResponse {
  category: Category | null
}

export class DeleteUserCategory {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    categoryId,
  }: DeleteUserCategoryRequest): Promise<DeleteUserCategoryResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new ResourceNotFound()
    }

    const deletedCategory = await this.categoriesRepository.delete(categoryId)

    return { category: deletedCategory }
  }
}

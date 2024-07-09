import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface UpdateUserCategoryRequest {
  userId: string
  category: {
    id: string
    name?: string
    description?: string | null
  }
}

interface UpdateUserCategoryResponse {
  category: Category | null
}

export class UpdateUserCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    category,
  }: UpdateUserCategoryRequest): Promise<UpdateUserCategoryResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const findCategory = await this.categoriesRepository.findById(category.id)

    if (!findCategory) {
      throw new ResourceNotFound()
    }

    const updatedCategory = await this.categoriesRepository.update({
      id: category.id,
      name: category.name,
      description: category.description,
    })

    return { category: updatedCategory }
  }
}

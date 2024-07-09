import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface UpdateUserCategoryUseCaseRequest {
  userId: string
  category: {
    id: string
    name?: string
    description?: string | null
  }
}

interface UpdateUserCategoryUseCaseResponse {
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
  }: UpdateUserCategoryUseCaseRequest): Promise<UpdateUserCategoryUseCaseResponse> {
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

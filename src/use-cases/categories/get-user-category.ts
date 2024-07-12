import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetUserCategoryUseCaseRequest {
  userId: string
  categoryId: string
}

interface GetUserCategoryUseCaseResponse {
  category: Category | null
}

export class GetUserCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    categoryId,
  }: GetUserCategoryUseCaseRequest): Promise<GetUserCategoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new ResourceNotFound()
    }

    return { category }
  }
}

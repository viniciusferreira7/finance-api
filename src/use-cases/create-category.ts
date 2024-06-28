import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { CategoryAlreadyExistError } from './error/category-already-exist-error'
import { ResourceNotFound } from './error/resource-not-found-error'

interface CreateCategoryUseCaseRequest {
  name: string
  description: string | null
  iconName: string | null
  userId: string
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    description,
    iconName,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const categoryWithSameName =
      await this.categoriesRepository.findByUserIdAndName(userId, name)

    if (categoryWithSameName) {
      throw new CategoryAlreadyExistError()
    }

    const category = await this.categoriesRepository.create({
      name,
      description,
      icon_name: iconName,
      user_id: userId,
    })

    return { category }
  }
}

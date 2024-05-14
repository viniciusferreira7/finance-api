import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'

import { CategoryAlreadyExistError } from './error/category-already-exist-error'

interface CreateCategoryUseCaseRequest {
  name: string
  description: string
  iconName?: string
  userId: string
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    description,
    iconName,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryWithSameName =
      await this.categoriesRepository.findByUserIdAndName(userId, name)

    if (categoryWithSameName) {
      throw new CategoryAlreadyExistError()
    }

    const category = await this.categoriesRepository.create({
      name,
      description,
      icon_name: iconName, // TODO: Create migration for this new field
      user_id: userId,
    })

    return { category }
  }
}

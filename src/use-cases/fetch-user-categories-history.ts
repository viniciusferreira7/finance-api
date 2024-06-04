import { Category } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface FetchUserCategoriesUseCaseRequest extends PaginationRequest {
  userId: string
}

type FetchUserCategoriesUseCaseResponse = PaginationResponse<Category>

export class FetchUserCategoriesHistoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    userId,
    page,
    per_page,
    pagination_disabled,
  }: FetchUserCategoriesUseCaseRequest): Promise<FetchUserCategoriesUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.categoriesRepository.findManyByUserId(userId, {
      page,
      per_page,
      pagination_disabled,
    })

    return { ...results }
  }
}

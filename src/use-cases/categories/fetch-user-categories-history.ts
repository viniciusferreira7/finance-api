import { Category } from '@prisma/client'

import { PaginationResponse } from '@/@types/pagination'
import { CategorySearchParams } from '@/@types/search-params'
import { CategoriesRepository } from '@/repositories/categories-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface FetchUserCategoriesUseCaseRequest {
  userId: string
  searchParams?: Partial<CategorySearchParams>
}

type FetchUserCategoriesUseCaseResponse = PaginationResponse<Category>

export class FetchUserCategoriesHistoryUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    searchParams,
  }: FetchUserCategoriesUseCaseRequest): Promise<FetchUserCategoriesUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const results = await this.categoriesRepository.findManyByUserId(userId, {
      page: searchParams?.page,
      per_page: searchParams?.per_page,
      pagination_disabled: searchParams?.pagination_disabled,
      name: searchParams?.name,
      description: searchParams?.description,
      sort: searchParams?.sort,
      createdAt: searchParams?.createdAt,
      updatedAt: searchParams?.updatedAt,
    })

    return { ...results }
  }
}

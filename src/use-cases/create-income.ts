import { Income } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { IncomeRepository } from '@/repositories/incomes.repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from './error/resource-not-found-error'

interface CreateIncomeRequest {
  value: number
  description: string | null
  category_id: string
  user_id: string
}

interface CreateIncomeResponse {
  income: Income
}

export class CreateIncomeUseCase {
  constructor(
    private incomesRepository: IncomeRepository,
    private categoriesRepositores: CategoriesRepository,
    private usersRepositores: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    value,
    description,
    category_id,
    user_id,
  }: CreateIncomeRequest): Promise<CreateIncomeResponse> {
    const category = await this.categoriesRepositores.findById(category_id)

    if (!category) {
      throw new ResourceNotFound()
    }

    const user = await this.usersRepositores.findById(user_id)

    if (!user) {
      throw new ResourceNotFound()
    }

    const convertsValueToCents = value * 100

    const income = await this.incomesRepository.create({
      value: convertsValueToCents,
      description,
      user_id,
      category_id,
    })

    return { income }
  }
}

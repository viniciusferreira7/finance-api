import { Income } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { IncomeHistories } from '@/repositories/income-histories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from './error/resource-not-found-error'

interface CreateIncomeRequest {
  name: string
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
    private incomesRepository: IncomesRepository,
    private incomeHistories: IncomeHistories,
    private categoriesRepositores: CategoriesRepository,
    private usersRepositores: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    name,
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

    const income = await this.incomesRepository.create({
      name,
      value: convertToCents(value),
      description,
      user_id,
      category_id,
    })

    await this.incomeHistories.create({
      name,
      value: convertToCents(value),
      description,
      user_id,
      category_id,
      income_id: income.id,
    })

    return { income }
  }
}

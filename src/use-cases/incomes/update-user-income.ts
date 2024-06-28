import { Income } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { IncomeHistoriesRepository } from '@/repositories/income-histories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface UpdateIncome {
  id: string
  name?: string
  value?: number
  description?: string | null
  categoryId?: string
}

interface UpdateUserIncomeUseCaseRequest {
  userId: string
  updateIncome: UpdateIncome
}

interface UpdateUserIncomeUseCaseResponse {
  income: Income | null
}

export class UpdateUserIncomeUseCase {
  constructor(
    private incomesRepository: IncomesRepository,
    private incomeHistoriesRepository: IncomeHistoriesRepository,
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    updateIncome,
  }: UpdateUserIncomeUseCaseRequest): Promise<UpdateUserIncomeUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = await this.incomesRepository.findById(updateIncome.id)

    if (!income) {
      throw new ResourceNotFound()
    }

    if (updateIncome?.categoryId) {
      const category = await this.categoriesRepository.findById(
        updateIncome.categoryId,
      )

      if (!category) {
        throw new ResourceNotFound()
      }
    }

    await this.incomeHistoriesRepository.create({
      name: updateIncome.name ?? income.name,
      value: convertToCents(updateIncome?.value),
      description: updateIncome.description,
      category_id: updateIncome.categoryId ?? income.category_id,
      income_id: income.id,
      user_id: user.id,
    })

    const updatedIncome = await this.incomesRepository.update({
      id: updateIncome.id,
      name: updateIncome.name,
      value: convertToCents(updateIncome?.value),
      description: updateIncome.description,
      categoryId: updateIncome.categoryId,
    })

    return { income: updatedIncome }
  }
}

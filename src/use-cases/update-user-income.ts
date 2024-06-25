import { Income } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from './error/resource-not-found-error'

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
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

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

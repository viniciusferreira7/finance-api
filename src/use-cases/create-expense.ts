import { Expense } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from './error/resource-not-found-error'

interface CreateExpenseUseCaseRequest {
  value: number
  description: string | null
  category_id: string
  user_id: string
}

interface CreateExpenseUseCaseResponse {
  expense: Expense
}

export class CreateExpenseUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    value,
    description,
    category_id,
    user_id,
  }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
    const category = await this.categoriesRepository.findById(category_id)

    if (!category) {
      throw new ResourceNotFound()
    }

    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new ResourceNotFound()
    }

    const expense = await this.expensesRepository.create({
      value: convertToCents(value),
      description,
      category_id,
      user_id,
    })

    return { expense }
  }
}

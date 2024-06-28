import { Expense } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { ResourceNotFound } from './error/resource-not-found-error'

interface UpdateExpense {
  id: string
  name?: string
  value?: number
  description?: string | null
  categoryId?: string
}

interface UpdateUserExpenseUseCaseRequest {
  userId: string
  updateExpense: UpdateExpense
}

interface UpdateUserExpenseUseCaseResponse {
  expense: Expense | null
}

export class UpdateUserExpenseUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private expenseHistoriesRepository: ExpenseHistoriesRepository,
    private categoriesRepository: CategoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    updateExpense,
  }: UpdateUserExpenseUseCaseRequest): Promise<UpdateUserExpenseUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const income = await this.expensesRepository.findById(updateExpense.id)

    if (!income) {
      throw new ResourceNotFound()
    }

    if (updateExpense?.categoryId) {
      const category = await this.categoriesRepository.findById(
        updateExpense.categoryId,
      )

      if (!category) {
        throw new ResourceNotFound()
      }
    }

    await this.expenseHistoriesRepository.create({
      name: updateExpense.name ?? income.name,
      value: convertToCents(updateExpense?.value),
      description: updateExpense.description,
      category_id: updateExpense.categoryId ?? income.category_id,
      income_id: income.id,
      user_id: user.id,
    })

    const updatedExpense = await this.expensesRepository.update({
      id: updateExpense.id,
      name: updateExpense.name,
      value: convertToCents(updateExpense?.value),
      description: updateExpense.description,
      categoryId: updateExpense.categoryId,
    })

    return { expense: updatedExpense }
  }
}

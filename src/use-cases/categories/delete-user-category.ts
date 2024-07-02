import { Category } from '@prisma/client'

import { CategoriesRepository } from '@/repositories/categories-repository'
import { ExpenseHistoriesRepository } from '@/repositories/expense-histories-repository'
import { ExpensesRepository } from '@/repositories/expenses-repository'
import { IncomeHistoriesRepository } from '@/repositories/income-histories-repository'
import { IncomesRepository } from '@/repositories/incomes-repository'
import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface DeleteUserCategoryRequest {
  userId: string
  categoryId: string
}

interface DeleteUserCategoryResponse {
  category: Category | null
}

export class DeleteUserCategory {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private incomesRepository: IncomesRepository,
    private incomeHistoriesRepository: IncomeHistoriesRepository,
    private expensesRepository: ExpensesRepository,
    private expenseHistoriesRepository: ExpenseHistoriesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    categoryId,
  }: DeleteUserCategoryRequest): Promise<DeleteUserCategoryResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new ResourceNotFound()
    }

    const deletedCategory = await this.categoriesRepository.delete(categoryId)

    await this.expensesRepository.updateManyByCategoryId(categoryId)
    await this.incomesRepository.updateManyByCategoryId(categoryId)

    await this.incomeHistoriesRepository.updateManyByCategoryId(categoryId)
    await this.expenseHistoriesRepository.updateManyByCategoryId(categoryId)

    return { category: deletedCategory }
  }
}

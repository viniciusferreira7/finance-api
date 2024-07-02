import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { ExpenseHistoriesRepository } from '../../expense-histories-repository'

export class PrismaExpenseHistoriesRepository
  implements ExpenseHistoriesRepository
{
  async updateManyByCategoryId(categoryId: string) {
    const { count } = await prisma.expense.updateMany({
      where: {
        category_id: categoryId,
      },
      data: {
        category_id: undefined,
      },
    })

    return count
  }

  async deleteMany(expenseId: string, userId: string) {
    const { count } = await prisma.expenseHistory.deleteMany({
      where: {
        expense_id: expenseId,
        user_id: userId,
      },
    })

    return count
  }

  async create(data: Prisma.ExpenseHistoryUncheckedCreateInput) {
    const Expense = await prisma.expenseHistory.create({
      data,
    })

    return Expense
  }
}

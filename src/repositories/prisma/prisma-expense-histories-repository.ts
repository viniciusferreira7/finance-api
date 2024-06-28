import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { ExpenseHistoriesRepository } from '../expense-histories-repository'

export class PrismaExpenseHistoriesRepository
  implements ExpenseHistoriesRepository
{
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

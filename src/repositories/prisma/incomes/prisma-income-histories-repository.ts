import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IncomeHistoriesRepository } from '../../income-histories-repository'

export class PrismaIncomeHistoriesRepository
  implements IncomeHistoriesRepository
{
  async updateManyByCategoryId(categoryId: string) {
    const { count } = await prisma.income.updateMany({
      where: {
        category_id: categoryId,
      },
      data: {
        category_id: undefined,
      },
    })

    return count
  }

  async deleteMany(incomeId: string, userId: string) {
    const { count } = await prisma.incomeHistory.deleteMany({
      where: {
        income_id: incomeId,
        user_id: userId,
      },
    })

    return count
  }

  async create(data: Prisma.IncomeHistoryUncheckedCreateInput) {
    const income = await prisma.incomeHistory.create({
      data,
    })

    return income
  }
}

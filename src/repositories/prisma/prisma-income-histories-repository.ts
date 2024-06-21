import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IncomeHistoriesRepository } from '../income-histories-repository'

export class PrismaIncomeHistoriesRepository
  // eslint-disable-next-line prettier/prettier
  implements IncomeHistoriesRepository {
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

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IncomeHistories } from '../income-histories'

export class PrismaIncomeHistories implements IncomeHistories {
  async create(data: Prisma.IncomeHistoryUncheckedCreateInput) {
    const income = await prisma.incomeHistory.create({
      data,
    })

    return income
  }
}

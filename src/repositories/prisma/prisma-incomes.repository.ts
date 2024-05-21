import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IncomesRepository } from '../incomes.repository'

export class PrismaIncomesRepository implements IncomesRepository {
  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income = await prisma.income.create({
      data,
    })
    return income
  }
}

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { IncomeRepository } from '../incomes.repository'

export class PrismaIncomesRepository implements IncomeRepository {
  async create(data: Prisma.IncomeCreateInput) {
    const income = await prisma.income.create({
      data,
    })
    return income
  }
}

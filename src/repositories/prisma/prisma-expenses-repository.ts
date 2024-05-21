import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { ExpensesRepository } from '../expenses-repository'

export class PrismaExpensesRepository implements ExpensesRepository {
  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense = await prisma.expense.create({
      data,
    })
    return expense
  }
}

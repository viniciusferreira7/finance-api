import { Income, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'

import { IncomesRepository } from '../incomes.repository'

export class PrismaIncomesRepository implements IncomesRepository {
  async findManyByUserId(
    userId: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<Income>> {
    const count = await prisma.income.count({
      where: {
        user_id: userId,
      },
    })

    const totalPages = Math.ceil(count / pagination.per_page)

    const incomes = await prisma.income.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'asc',
      },
      take: pagination.per_page,
      skip: pagination.page * pagination.per_page, // TODO: an error could probably occur here
    })

    const nextPage = totalPages === pagination.page ? null : pagination.page + 1
    const previousPage = pagination.page === 1 ? null : pagination.page - 1

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: pagination.page,
      per_page: pagination.per_page,
      total_pages: totalPages,
      results: incomes,
    }
  }

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income = await prisma.income.create({
      data,
    })
    return income
  }
}

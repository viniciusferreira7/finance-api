import { Income, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'

import { IncomesRepository } from '../../incomes-repository'

interface UpdateIncome {
  id: string
  name?: string
  value?: number
  description?: string
  categoryId?: string
}

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

    if (pagination.pagination_disabled) {
      const incomes = await prisma.income.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          category: true,
        },
      })

      return {
        count,
        next: 0,
        previous: 0,
        page: 1,
        per_page: count,
        pagination_disabled: !!pagination.pagination_disabled,
        total_pages: 1,
        results: incomes,
      }
    }

    const perPage = pagination?.per_page ?? 10
    const currentPage = pagination?.page ?? 1

    const totalPages = Math.ceil(count / perPage)

    const incomesPaginated = await prisma.income.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'asc',
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    })

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: currentPage,
      per_page: perPage,
      total_pages: totalPages,
      pagination_disabled: !!pagination.pagination_disabled,
      results: incomesPaginated,
    }
  }

  async findById(id: string) {
    const income = await prisma.income.findUnique({
      where: {
        id,
      },
    })

    return income
  }

  async delete(id: string) {
    const income = await prisma.income.delete({
      where: {
        id,
      },
    })

    return income
  }

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

  async update(updateIncome: UpdateIncome) {
    const prismaIncome = await prisma.income.update({
      where: {
        id: updateIncome.id,
      },
      data: {
        name: updateIncome.name,
        value: updateIncome.value,
        description: updateIncome.description,
        update_at: new Date(),
        category_id: updateIncome.categoryId,
      },
    })

    return prismaIncome
  }

  async create(data: Prisma.IncomeUncheckedCreateInput) {
    const income = await prisma.income.create({
      data,
    })
    return income
  }
}

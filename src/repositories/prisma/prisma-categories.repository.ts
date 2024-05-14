import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { CategoriesRepository } from '../categories-repository'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findByUserIdAndName(userId: string, name: string) {
    const category = await prisma.category.findFirst({
      where: {
        user_id: userId,
        name: {
          equals: name,
        },
      },
    })

    return category
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })

    return category
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = await prisma.category.create({
      data,
    })

    return category
  }
}

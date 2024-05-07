import { prisma } from '@/lib/prisma'

import { CategoriesRepository } from '../categories-repository'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    })

    return category
  }
}

import { faker } from '@faker-js/faker'

import { prisma } from '@/lib/prisma'

interface GenerateCategories {
  userId: string
  amount: number
}

export async function generateCategories({
  userId,
  amount,
}: GenerateCategories) {
  const categories = Array.from({ length: amount }).map(() => {
    return {
      name: faker.lorem.words({ min: 1, max: 5 }),
      description: faker.lorem.lines({ min: 1, max: 4 }),
      created_at: faker.date.recent({ days: 120 }),
      user_id: userId,
    }
  })

  await prisma.category.createMany({
    data: categories,
  })

  const categoriesCreated = await prisma.category.findMany({
    where: {
      user_id: userId,
    },
  })

  return { categoriesCreated }
}

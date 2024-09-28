import { faker } from '@faker-js/faker'
import { Category, Income, IncomeHistory } from '@prisma/client'
import { randomUUID } from 'crypto'

import { prisma } from '@/lib/prisma'

import { convertToCents } from '../convert-to-cents'
import { generateCategories } from './generate-categories'

interface GenerateIncomes {
  userId: string
  amount: number
  categoriesInfo?: {
    isExternal?: boolean
    categories?: Category[]
    amount?: number
  }
  withIncomeHistories: {
    amount?: number
    min?: number
    max?: number
    disabled: boolean
  }
  dateRage?: {
    createdAt?: number[]
    updatedAt?: number[]
  }
}

export async function generateIncomes({
  userId,
  amount,
  categoriesInfo,
  withIncomeHistories,
  dateRage,
}: GenerateIncomes) {
  const incomes: Income[] = []
  const incomeHistories: IncomeHistory[] = []
  const categories: Category[] = []

  if (!categoriesInfo?.isExternal) {
    const { categoriesCreated } = await generateCategories({
      userId,
      amount: categoriesInfo?.amount ?? 0,
    })

    categories.push(...categoriesCreated)
  } else if (categoriesInfo.categories) {
    categories.push(...categoriesInfo.categories)
  }

  for (let i = 0; i <= (amount === 1 ? 1 : amount - 1); i++) {
    const incomeId = randomUUID()

    const description = faker.helpers.arrayElement([
      faker.lorem.lines({ min: 1, max: 10 }),
      faker.lorem.lines({ min: 5, max: 15 }),
      null,
    ])

    const createdAtRages = dateRage?.createdAt
      ? dateRage?.createdAt.map((days) => {
          return faker.date.recent({ days })
        })
      : [faker.date.recent({ days: 120 })]

    const createdAt = faker.helpers.arrayElement(createdAtRages)

    const updatedAtRages = dateRage?.updatedAt
      ? dateRage?.updatedAt.map((days) => {
          return faker.date.recent({ days })
        })
      : [
          createdAt,
          faker.date.recent({ days: 45 }),
          faker.date.recent({ days: 100 }),
        ]

    const updatedAt = faker.helpers.arrayElement(updatedAtRages)

    const categoryId = categories.length
      ? faker.helpers.arrayElement([...categories.map((item) => item.id)])
      : null

    const income: Income = {
      id: incomeId,
      name: faker.finance.accountName(),
      value: convertToCents(
        Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
      ),
      description,
      user_id: userId,
      category_id: categoryId,
      created_at: createdAt,
      updated_at: updatedAt,
    }

    incomes.push(income)
  }

  await prisma.income.createMany({
    data: incomes,
  })

  if (!withIncomeHistories.disabled) {
    function getCategoriesAndGenerateCategoryId() {
      const categoryId = faker.helpers.arrayElement([
        ...categories.map((category) => category.id),
        ...categories.map((category) => category.id),
        null,
      ])

      return categoryId
    }

    incomes.forEach((income) => {
      function generateIncomeHistory() {
        const updateDescription = faker.helpers.arrayElement([
          faker.lorem.lines({ min: 1, max: 10 }),
          faker.lorem.lines({ min: 10, max: 15 }),
          null,
        ])

        const incomeHistory: IncomeHistory = {
          id: randomUUID(),
          name: faker.finance.accountName(),
          value: convertToCents(
            Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
          ),
          description: updateDescription,
          user_id: userId,
          category_id: getCategoriesAndGenerateCategoryId(),
          income_id: income.id,
          created_at: income.updated_at,
        }

        return incomeHistory
      }

      const historyRange = faker.helpers.arrayElements(
        Array.from({ length: withIncomeHistories.amount ?? 45 }),
        {
          min: withIncomeHistories?.min ?? 5,
          max: withIncomeHistories?.max ?? 35,
        },
      )

      historyRange.forEach(() => {
        if (income.created_at !== income.updated_at) {
          incomeHistories.push(generateIncomeHistory())
        }
      })
    })
    await prisma.incomeHistory.createMany({
      data: incomeHistories,
    })
  }

  return { categories, incomes, incomeHistories }
}

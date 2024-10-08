import { faker } from '@faker-js/faker'
import { Category, Expense, ExpenseHistory } from '@prisma/client'
import { randomUUID } from 'crypto'

import { prisma } from '@/lib/prisma'

import { convertToCents } from '../convert-to-cents'
import { generateCategories } from './generate-categories'

interface GenerateExpenses {
  userId: string
  amount: number
  categoriesInfo?: {
    isExternal?: boolean
    categories?: Category[]
    amount?: number
  }
  withExpenseHistories: {
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

export async function generateExpenses({
  userId,
  amount,
  categoriesInfo,
  withExpenseHistories,
  dateRage,
}: GenerateExpenses) {
  const expenses: Expense[] = []
  const expenseHistories: ExpenseHistory[] = []
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
    const expenseId = randomUUID()

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

    const expense: Expense = {
      id: expenseId,
      name: faker.finance.accountName(),
      value: convertToCents(
        Number(faker.finance.amount({ min: 10, max: 10_000 })),
      ),
      description,
      user_id: userId,
      category_id: categoryId,
      created_at: createdAt,
      updated_at: updatedAt,
    }

    expenses.push(expense)
  }

  await prisma.expense.createMany({
    data: expenses,
  })

  if (!withExpenseHistories.disabled) {
    function getCategoriesAndGenerateCategoryId() {
      const categoryId = faker.helpers.arrayElement([
        ...categories.map((category) => category.id),
        ...categories.map((category) => category.id),
        null,
      ])

      return categoryId
    }

    expenses.forEach((expense) => {
      function generateExpenseHistory() {
        const updateDescription = faker.helpers.arrayElement([
          faker.lorem.lines({ min: 1, max: 10 }),
          faker.lorem.lines({ min: 10, max: 15 }),
          null,
        ])

        const expenseHistory: ExpenseHistory = {
          id: randomUUID(),
          name: faker.finance.accountName(),
          value: convertToCents(
            Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
          ),
          description: updateDescription,
          user_id: userId,
          category_id: getCategoriesAndGenerateCategoryId(),
          expense_id: expense.id,
          created_at: expense.updated_at,
        }

        return expenseHistory
      }

      const historyRange = faker.helpers.arrayElements(
        Array.from({ length: withExpenseHistories.amount ?? 45 }),
        {
          min: withExpenseHistories?.min ?? 5,
          max: withExpenseHistories?.max ?? 35,
        },
      )

      historyRange.forEach(() => {
        if (expense.created_at !== expense.updated_at) {
          expenseHistories.push(generateExpenseHistory())
        }
      })
    })
    await prisma.expenseHistory.createMany({
      data: expenseHistories,
    })
  }

  return { categories, expenses, expenseHistories }
}

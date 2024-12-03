import { faker } from '@faker-js/faker'
import {
  Expense,
  ExpenseHistory,
  Income,
  IncomeHistory,
  PrismaClient,
} from '@prisma/client'
import { hash } from 'bcryptjs'
import chalk from 'chalk'
import { randomUUID } from 'crypto'

import { convertToCents } from '@/utils/convert-to-cents'

const prisma = new PrismaClient()

async function seed() {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const userId = '9d656623-c105-47f4-8cad-8b8d6fb9293f'

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  tables.split(',').forEach((tableName) => {
    console.log(chalk.greenBright(`Trucante table: ${tableName}  ✔️`))
  })

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log({ error })
  }

  const oldUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (oldUser) {
    await prisma.user.delete({
      where: {
        id: oldUser.id,
      },
    })
  }

  // Create a user

  const newUser = await prisma.user.create({
    data: {
      id: userId,
      name: 'John doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    },
  })

  console.log(chalk.yellowBright('Created a user ✔️'))

  // Create categories

  function generateCategories() {
    const categories = Array.from({ length: 30 }).map(() => {
      return {
        name: faker.lorem.words({ min: 1, max: 5 }),
        description: faker.lorem.lines({ min: 1, max: 4 }),
        created_at: faker.date.recent({ days: 120 }),
        user_id: newUser.id,
      }
    })

    return faker.helpers.arrayElements(categories, { min: 10, max: 30 })
  }

  await prisma.category.createMany({
    data: generateCategories(),
  })

  console.log(chalk.yellowBright('Created categories ✔️'))

  // Create Incomes

  const categories = await prisma.category.findMany({
    where: {
      user_id: newUser.id,
    },
    select: {
      id: true,
    },
  })

  function getCategoriesAndGenerateCategoryId() {
    const categoryId = faker.helpers.arrayElement([
      ...categories.map((category) => category.id),
      ...categories.map((category) => category.id),
      null,
    ])

    return categoryId
  }

  const incomes: Income[] = []
  const incomeHistories: IncomeHistory[] = []

  for (let i = 0; i <= 500; i++) {
    const incomeId = randomUUID()

    const description = faker.helpers.arrayElement([
      faker.lorem.lines({ min: 1, max: 10 }),
      faker.lorem.lines({ min: 5, max: 15 }),
      null,
    ])

    const createdAt = faker.date.recent({ days: 365 * 2 })
    const updatedAt = faker.helpers.arrayElement([
      createdAt,
      faker.date.recent({ days: 250 }),
      faker.date.recent({ days: 200 }),
      faker.date.recent({ days: 100 }),
      faker.date.recent({ days: 50 }),
    ])

    const income: Income = {
      id: incomeId,
      name: faker.finance.accountName(),
      value: convertToCents(
        Number(faker.finance.amount({ min: 10, max: 10_000 })),
      ),
      description,
      user_id: newUser.id,
      category_id: getCategoriesAndGenerateCategoryId(),
      created_at: createdAt,
      updated_at: updatedAt,
    }

    incomes.push(income)
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
          Number(faker.finance.amount({ min: 10, max: 20_000 })),
        ),
        description: updateDescription,
        user_id: newUser.id,
        category_id: getCategoriesAndGenerateCategoryId(),
        income_id: income.id,
        created_at: income.updated_at,
      }

      return incomeHistory
    }

    const historyRange = faker.helpers.arrayElements(
      Array.from({ length: 45 }),
      {
        min: 5,
        max: 35,
      },
    )

    historyRange.forEach(() => {
      if (income.created_at !== income.updated_at) {
        incomeHistories.push(generateIncomeHistory())
      }
    })
  })

  await prisma.income.createMany({
    data: incomes,
  })

  await prisma.incomeHistory.createMany({
    data: incomeHistories,
  })

  console.log(chalk.yellowBright('Created incomes ✔️'))

  // Create expenses

  const expenses: Expense[] = []
  const expensesHistories: ExpenseHistory[] = []

  for (let i = 0; i <= 700; i++) {
    const expenseId = randomUUID()

    const description = faker.helpers.arrayElement([
      faker.lorem.lines({ min: 1, max: 10 }),
      faker.lorem.lines({ min: 5, max: 15 }),
      null,
    ])

    const createdAt = faker.date.recent({ days: 365 * 2 })
    const updatedAt = faker.helpers.arrayElement([
      createdAt,
      faker.date.recent({ days: 250 }),
      faker.date.recent({ days: 200 }),
      faker.date.recent({ days: 100 }),
      faker.date.recent({ days: 50 }),
    ])

    const expense: Expense = {
      id: expenseId,
      name: faker.commerce.productName(),
      value: convertToCents(
        Number(faker.commerce.price({ min: 10, max: 1_000 })),
      ),
      description,
      user_id: newUser.id,
      category_id: getCategoriesAndGenerateCategoryId(),
      created_at: createdAt,
      updated_at: updatedAt,
    }

    expenses.push(expense)
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
        name: faker.commerce.productName(),
        value: convertToCents(
          Number(faker.commerce.price({ min: 10, max: 1_000 })),
        ),
        description: updateDescription,
        user_id: newUser.id,
        category_id: getCategoriesAndGenerateCategoryId(),
        expense_id: expense.id,
        created_at: expense.updated_at,
      }

      return expenseHistory
    }

    const historyRange = faker.helpers.arrayElements(
      Array.from({ length: 45 }),
      {
        min: 5,
        max: 35,
      },
    )

    historyRange.forEach(() => {
      if (expense.created_at !== expense.updated_at) {
        expensesHistories.push(generateExpenseHistory())
      }
    })
  })

  await prisma.expense.createMany({
    data: expenses,
  })

  await prisma.expenseHistory.createMany({
    data: expensesHistories,
  })

  console.log(chalk.yellowBright('Created expenses ✔️'))
}

seed().then(() => {
  console.log(chalk.greenBright('Database seeded ✔️'))
  prisma.$disconnect()
})

import { faker } from '@faker-js/faker'
import { Expense, ExpenseHistory, Income, IncomeHistory } from '@prisma/client'
import { hash } from 'bcryptjs'
import chalk from 'chalk'
import { randomUUID } from 'crypto'

import { prisma } from '@/lib/prisma'
import { convertToCents } from '@/utils/convert-to-cents'

async function seed() {
  const userId = '9d656623-c105-47f4-8cad-8b8d6fb9293f'

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

  function generateCategory() {
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
    data: generateCategory(),
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

  const categoryId = faker.helpers.arrayElement([
    ...categories.map((category) => category.id),
    ...categories.map((category) => category.id),
    null,
  ])

  const incomes: Income[] = []
  const incomeHistories: IncomeHistory[] = []

  for (let i = 0; i <= 200; i++) {
    const incomeId = randomUUID()

    const description = faker.helpers.arrayElement([
      faker.lorem.lines({ min: 1, max: 10 }),
      faker.lorem.lines({ min: 5, max: 15 }),
      null,
    ])

    const createdAt = faker.date.recent({ days: 120 })
    const updatedAt = faker.helpers.arrayElement([
      createdAt,
      faker.date.recent({ days: 100 }),
      faker.date.recent({ days: 45 }),
    ])

    const income: Income = {
      id: incomeId,
      name: faker.finance.accountName(),
      value: convertToCents(
        Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
      ),
      description,
      user_id: newUser.id,
      category_id: categoryId,
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
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        description: updateDescription,
        user_id: newUser.id,
        category_id: categoryId,
        income_id: income.id,
        created_at: income.updated_at,
      }

      return incomeHistory
    }

    const historyRange = faker.helpers.arrayElements(
      Array.from({ length: 10 }),
      {
        min: 1,
        max: 10,
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

  for (let i = 0; i <= 200; i++) {
    const expenseId = randomUUID()

    const description = faker.helpers.arrayElement([
      faker.lorem.lines({ min: 1, max: 10 }),
      faker.lorem.lines({ min: 5, max: 15 }),
      null,
    ])

    const createdAt = faker.date.recent({ days: 120 })
    const updatedAt = faker.helpers.arrayElement([
      createdAt,
      faker.date.recent({ days: 100 }),
      faker.date.recent({ days: 45 }),
    ])

    const expense: Expense = {
      id: expenseId,
      name: faker.finance.accountName(),
      value: convertToCents(
        Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
      ),
      description,
      user_id: newUser.id,
      category_id: categoryId,
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
        name: faker.finance.accountName(),
        value: convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        description: updateDescription,
        user_id: newUser.id,
        category_id: categoryId,
        expense_id: expense.id,
        created_at: expense.updated_at,
      }

      return expenseHistory
    }

    const historyRange = faker.helpers.arrayElements(
      Array.from({ length: 10 }),
      {
        min: 1,
        max: 10,
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

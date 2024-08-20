import { faker } from '@faker-js/faker'
import { Expense } from '@prisma/client'
import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryExpensesRepository } from '@/repositories/in-memory/expenses/in-memory-expenses-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { GetMetricsMonthlyExpense } from './get-metrics-monthly-expense'

let usersRepository: InMemoryUsersRepository
let expensesRepository: InMemoryExpensesRepository
let sut: GetMetricsMonthlyExpense

describe('Get metrics monthly expense', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    expensesRepository = new InMemoryExpensesRepository()
    sut = new GetMetricsMonthlyExpense(usersRepository, expensesRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get metrics monthly expense', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 0, 0))

    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const valueToFilter = convertToCents(4000)
    const categoryToFilter = 'category-to-filter'

    const expenses: Expense[] = []

    const oneDayInMilliseconds = 1000 * 60 * 60 * 24

    for (let i = 1; i <= 35; i++) {
      vi.advanceTimersByTime(oneDayInMilliseconds)

      const value = faker.helpers.arrayElement([
        valueToFilter,
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
        convertToCents(
          Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
        ),
      ])

      const categoryId =
        value === valueToFilter ? categoryToFilter : `category-${i}`

      const expense = await expensesRepository.create({
        name: 'Job',
        value,
        description: 'Salary',
        category_id: categoryId,
        user_id: user.id,
        created_at: new Date(),
      })

      expenses.push(expense)
    }

    const { amount, diff_from_last_month } = await sut.execute({
      userId: user.id,
    })

    expect(amount).toEqual(expect.any(Number))
    expect(diff_from_last_month).toEqual(expect.any(Number))
  })
})

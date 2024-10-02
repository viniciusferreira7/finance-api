import type { Expense, User } from '@prisma/client'
import dayjs from 'dayjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { app } from '@/app'
import { generateCategories } from '@/utils/test/generate-categories'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

type MonthlyBalanceOverTimeUseCaseResponse = Array<{
  date: string
  balance: number
}>

type MonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

type CategoriesWithTheMostRecordResponse = Array<{
  name: string
  incomes_quantity: number
  expenses_quantity: number
}>

let token: string
let user: User

describe('Get metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    const registeredUser = await registerAndAuthenticateUser(app)

    token = registeredUser.token
    user = registeredUser.user

    vi.useFakeTimers()
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const { categoriesCreated } = await generateCategories({
      userId: user.id,
      amount: 12,
    })

    await Promise.all([
      await generateIncomes({
        userId: user.id,
        amount: 100,
        categoriesInfo: {
          isExternal: true,
          categories: categoriesCreated,
        },
        withIncomeHistories: {
          min: 20,
          max: 20,
          disabled: false,
        },
        dateRage: {
          createdAt: [365],
          updatedAt: [250, 200],
        },
      }),
      await generateExpenses({
        userId: user.id,
        amount: 100,
        categoriesInfo: {
          isExternal: true,
          categories: categoriesCreated,
        },
        withExpenseHistories: {
          min: 20,
          max: 20,
          disabled: false,
        },
        dateRage: {
          createdAt: [365],
          updatedAt: [250, 200],
        },
      }),
    ])
  })

  afterAll(async () => {
    vi.useRealTimers()

    await app.close()
  })

  it('should be able to get monthly financial summary', async () => {
    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const monthlyFinancialSummary: MonthlyFinancialSummaryResponse =
      response.body.monthly_financial_summary

    const endDate = dayjs('2000-01')

    expect(response.statusCode).toEqual(200)

    expect(
      monthlyFinancialSummary.reverse().every((item, index) => {
        const expectedMonth = endDate
          .add(1, 'month')
          .subtract(1 + index, 'months')
          .format('YYYY-MM')

        return item.date === expectedMonth
      }),
    ).toEqual(true)

    expect(monthlyFinancialSummary.length).toBeLessThanOrEqual(12)
    expect(monthlyFinancialSummary).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          incomes_total: expect.any(Number),
          expenses_total: expect.any(Number),
        }),
      ]),
    )
  })

  it('should be able to get categories with most records', async () => {
    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const categoriesWithMostRecords: CategoriesWithTheMostRecordResponse =
      response.body.categories_with_most_records

    expect(response.statusCode).toEqual(200)

    expect(categoriesWithMostRecords.length).toBeGreaterThanOrEqual(1)

    expect(categoriesWithMostRecords).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          incomes_quantity: expect.any(Number),
          expenses_quantity: expect.any(Number),
        }),
      ]),
    )
  })

  it('should be able to get biggest expenses', async () => {
    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const biggestExpenses: Expense[] = response.body.biggest_expenses

    expect(response.statusCode).toEqual(200)

    expect(biggestExpenses.length).toBeLessThanOrEqual(10)

    expect(biggestExpenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          value: expect.any(String),
          category_id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      ]),
    )
  })

  it.only('should be able to get monthly balance over time', async () => {
    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const monthlyBalanceOverTime: MonthlyBalanceOverTimeUseCaseResponse =
      response.body.monthly_balance_over_time

    const endDate = dayjs('2000-01')

    expect(response.statusCode).toEqual(200)

    expect(
      monthlyBalanceOverTime.reverse().every((item, index) => {
        const expectedMonth = endDate
          .add(1, 'month')
          .subtract(1 + index, 'months')
          .format('YYYY-MM')

        return item.date === expectedMonth
      }),
    ).toEqual(true)

    expect(monthlyBalanceOverTime.length).toBeLessThanOrEqual(12)
    expect(monthlyBalanceOverTime).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          balance: expect.any(Number),
        }),
      ]),
    )
  })
})

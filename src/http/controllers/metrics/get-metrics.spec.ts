import dayjs from 'dayjs'
import request from 'supertest'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

type MonthlyFinancialSummaryResponse = Array<{
  date: string
  incomes_total: number
  expenses_total: number
}>

describe('Get metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get metrics', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 1, 13, 40))

    const { token, user } = await registerAndAuthenticateUser(app)

    await Promise.all([
      await generateIncomes({
        userId: user.id,
        amount: 100,
        withCategory: true,
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
        withCategory: true,
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
})

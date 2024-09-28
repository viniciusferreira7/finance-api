import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Get balance (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get balance by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateExpenses({
      userId: user.id,
      amount: 20,
      categoriesInfo: {
        amount: 3,
      },
      withExpenseHistories: {
        disabled: true,
      },
    })

    await generateIncomes({
      userId: user.id,
      amount: 20,
      categoriesInfo: {
        amount: 3,
      },
      withIncomeHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get('/balance')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        incomes_total: expect.any(Number),
        expenses_total: expect.any(Number),
        balance_total: expect.any(Number),
      }),
    )
  })
})

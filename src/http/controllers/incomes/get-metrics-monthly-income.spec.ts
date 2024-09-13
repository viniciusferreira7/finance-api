import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Get metrics monthly income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get metrics monthly income by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateIncomes({
      userId: user.id,
      amount: 30,
      withCategory: true,
      withIncomeHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get('/incomes/metrics-monthly')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.amount).toEqual(expect.any(Number))
    expect(response.body.diff_from_last_month).toEqual(expect.any(Number))
  })
})

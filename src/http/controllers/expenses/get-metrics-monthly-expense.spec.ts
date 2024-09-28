import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Get metrics monthly expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get metrics monthly expense by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateExpenses({
      userId: user.id,
      amount: 500,
      categoriesInfo: {
        amount: 15,
      },
      withExpenseHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get('/expenses/metrics-monthly')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.amount).toEqual(expect.any(Number))
    expect(response.body.diff_from_last_month).toEqual(expect.any(Number))
  })
})

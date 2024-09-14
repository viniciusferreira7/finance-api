import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Get an expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an expense', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { expenses } = await generateExpenses({
      userId: user.id,
      amount: 1,
      withCategory: true,
      withExpenseHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get(`/expenses/${expenses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expenses[0].id,
      }),
    )
  })
})

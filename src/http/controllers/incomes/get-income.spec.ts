import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Get an income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an income', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { incomes } = await generateIncomes({
      userId: user.id,
      amount: 1,
      withCategory: true,
      withHistory: false,
    })

    const response = await request(app.server)
      .get(`/incomes/${incomes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: incomes[0].id,
      }),
    )
  })
})

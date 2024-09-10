import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Update an income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update an income', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { incomes } = await generateIncomes({
      userId: user.id,
      amount: 1,
      withCategory: true,
      withHistory: false,
    })

    const response = await request(app.server)
      .put(`/incomes/${incomes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        value: (5000).toString(),
        name: 'updated-income',
        description: null,
      })

    expect(response.statusCode).toEqual(204)

    const getIncomeResponse = await request(app.server)
      .get(`/incomes/${incomes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getIncomeResponse.body).toEqual(
      expect.objectContaining({
        value: 5000 * 100,
        name: 'updated-income',
        description: '',
      }),
    )
  })
})

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Delete an income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an income', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { incomes } = await generateIncomes({
      userId: user.id,
      amount: 1,
      categoriesInfo: {
        amount: 2,
      },
      withIncomeHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .delete(`/incomes/${incomes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const getIncomeResponse = await request(app.server)
      .get(`/incomes/${incomes[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getIncomeResponse.statusCode).toEqual(404)
    expect(getIncomeResponse.body.message).toBe('Resource not found.')
  })
})

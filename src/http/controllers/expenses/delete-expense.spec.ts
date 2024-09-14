import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Delete an expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete an expense', async () => {
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
      .delete(`/expenses/${expenses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const getExpenseResponse = await request(app.server)
      .get(`/expenses/${expenses[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getExpenseResponse.statusCode).toEqual(404)
    expect(getExpenseResponse.body.message).toBe('Resource not found.')
  })
})

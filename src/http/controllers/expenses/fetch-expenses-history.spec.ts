import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Fetch expenses history (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch expenses by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateExpenses({
      userId: user.id,
      amount: 20,
      withCategory: true,
      withExpenseHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: 20,
        next: 2,
        previous: null,
        page: 1,
        total_pages: 2,
        per_page: 10,
        pagination_disabled: false,
      }),
    )
  })
})

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateExpenses } from '@/utils/test/generate-expenses'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Fetch expense histories (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch expense histories by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { expenses } = await generateExpenses({
      userId: user.id,
      amount: 2,
      categoriesInfo: {
        amount: 1,
      },
      withExpenseHistories: {
        min: 20,
        max: 20,
        disabled: false,
      },
    })

    const response = await request(app.server)
      .get(`/expense-histories/${expenses[0].id}`)
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
        results: expect.any(Array),
      }),
    )
    expect(response.body.results).length(10)
  })
})

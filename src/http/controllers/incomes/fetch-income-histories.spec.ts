import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Fetch income histories (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch income histories by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { incomes } = await generateIncomes({
      userId: user.id,
      amount: 2,
      categoriesInfo: {
        amount: 1,
      },
      withIncomeHistories: {
        min: 20,
        max: 20,
        disabled: false,
      },
    })

    const response = await request(app.server)
      .get(`/income-histories/${incomes[0].id}`)
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

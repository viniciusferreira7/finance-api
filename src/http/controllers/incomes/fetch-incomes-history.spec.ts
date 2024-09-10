import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateIncomes } from '@/utils/test/generate-incomes'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Fetch incomes history (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch incomes by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateIncomes({
      userId: user.id,
      amount: 20,
      withCategory: true,
      withIncomeHistories: {
        disabled: true,
      },
    })

    const response = await request(app.server)
      .get('/incomes')
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

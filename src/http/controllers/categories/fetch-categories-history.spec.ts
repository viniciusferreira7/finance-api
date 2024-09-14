import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateCategories } from '@/utils/test/generate-categories'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Fetch categories history (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch categories by user', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    await generateCategories({
      userId: user.id,
      amount: 20,
    })

    const response = await request(app.server)
      .get('/categories')
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

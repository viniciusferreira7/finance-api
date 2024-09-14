import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateCategories } from '@/utils/test/generate-categories'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Update a category (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update a category', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { categoriesCreated: categories } = await generateCategories({
      userId: user.id,
      amount: 1,
    })

    const response = await request(app.server)
      .put(`/categories/${categories[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'updated-category',
        description: null,
      })

    expect(response.statusCode).toEqual(204)

    const getCategoryResponse = await request(app.server)
      .get(`/categories/${categories[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getCategoryResponse.body).toEqual(
      expect.objectContaining({
        name: 'updated-category',
        description: '',
      }),
    )
  })
})

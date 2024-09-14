import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { generateCategories } from '@/utils/test/generate-categories'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Delete a category (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a category', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const { categoriesCreated: categories } = await generateCategories({
      userId: user.id,
      amount: 1,
    })

    const response = await request(app.server)
      .delete(`/categories/${categories[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const getCategoryResponse = await request(app.server)
      .get(`/categories/${categories[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(getCategoryResponse.statusCode).toEqual(404)
    expect(getCategoryResponse.body.message).toBe('Resource not found.')
  })
})

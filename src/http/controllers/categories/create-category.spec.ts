import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Create a category (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a category', async () => {
    const { token } = await registerAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Recreation',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel auctor tortor, ac ornare mauris. Aliquam erat volutpat. Ut consequat blandit justo, et maximus dolor pulvinar non. ',
      })

    expect(response.statusCode).toEqual(201)
  })
})

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Create an expense (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an expense', async () => {
    const { token } = await registerAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'job',
        value: 1000,
        description: 'game',
        category_id: null,
      })

    expect(response.statusCode).toEqual(201)
  })
})

import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await registerAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'john.doe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
    )
  })
})

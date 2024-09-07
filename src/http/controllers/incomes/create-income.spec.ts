import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { registerAndAuthenticateUser } from '@/utils/test/register-and-authenticate'

describe('Create an income (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an income', async () => {
    const { user, token } = await registerAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/incomes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'job',
        value: 1000,
        description: 'Salary',
        category_id: null,
        user_id: user.id,
      })

    expect(response.statusCode).toEqual(201)
  })
})

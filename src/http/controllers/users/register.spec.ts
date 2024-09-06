import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  console.log(env)

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${env.FINANCE_APP_TOKEN}`)

      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })
    expect(response.statusCode).toEqual(201)
  })
})

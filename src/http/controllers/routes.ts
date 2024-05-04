import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middleware/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  // Authenticate
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )

  // app.post('/income', createIncome)
}

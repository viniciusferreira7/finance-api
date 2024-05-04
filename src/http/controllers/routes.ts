import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { register } from './register'
import { profile } from './profile'
import { verifyJWT } from '../middleware/verify-jwt'

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

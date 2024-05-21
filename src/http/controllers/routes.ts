import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middleware/verify-jwt'
import { authenticate } from './authenticate'
import { createCategory } from './create-category'
import { createExpense } from './create-expense'
import { createIncome } from './create-income'
import { profile } from './profile'
import { register } from './register'

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticate
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )

  app.post(
    '/incomes',
    {
      onRequest: [verifyJWT],
    },
    createIncome,
  )

  app.post(
    '/expenses',
    {
      onRequest: [verifyJWT],
    },
    createExpense,
  )

  app.post(
    '/category',
    {
      onRequest: [verifyJWT],
    },
    createCategory,
  )
}

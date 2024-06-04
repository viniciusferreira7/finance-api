import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middleware/verify-jwt'
import { authenticate } from './authenticate'
import { createCategory } from './create-category'
import { createExpense } from './create-expense'
import { createIncome } from './create-income'
import { fetchCategories } from './fetch-categories'
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
    '/categories',
    {
      onRequest: [verifyJWT],
    },
    createCategory,
  )

  app.get(
    '/categories',
    {
      schema: {
        querystring: {
          page: { type: 'string' },
          per_page: { type: 'string' },
          pagination_disabled: { type: 'string' },
        },
      },
      onRequest: [verifyJWT],
    },
    fetchCategories,
  )
}

// TODO: Create another methods of GET, DELETE, PUT for the incomes, categories and expanse

// TODO: Finally create use case from monthly budget and balance
// TODO: Create E2E test

import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middleware/verify-jwt'
import { authenticate } from './authenticate'
import { createCategory } from './create-category'
import { createExpense } from './create-expense'
import { createIncome } from './create-income'
import { fetchCategoriesHistory } from './fetch-categories-history'
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
    '/income',
    {
      onRequest: [verifyJWT],
    },
    createIncome,
  )

  app.get(
    '/incomes',
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
    fetchCategoriesHistory,
  )

  app.post(
    '/expense',
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
    fetchCategoriesHistory,
  )
}

// TODO: Create another methods of GET, DELETE, PUT for the incomes, categories and expanse

// TODO: Finally create use case from monthly budget and balance
// TODO: Create E2E test

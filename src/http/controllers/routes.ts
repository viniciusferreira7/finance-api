import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middleware/verify-jwt'
import { authenticate } from './authenticate'
import { createCategory } from './create-category'
import { createExpense } from './create-expense'
import { createIncome } from './create-income'
import { deleteExpense } from './delete-expense'
import { deleteIncome } from './delete-income'
import { fetchCategoriesHistory } from './fetch-categories-history'
import { fetchExpensesHistory } from './fetch-expenses-history'
import { profile } from './profile'
import { register } from './register'

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticate
  app.get('/me', { onRequest: [verifyJWT] }, profile)

  app.post('/income', { onRequest: [verifyJWT] }, createIncome)

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

  app.delete('/incomes/:id', { onRequest: [verifyJWT] }, deleteIncome)

  app.post('/expenses', { onRequest: [verifyJWT] }, createExpense)

  app.get(
    '/expenses',
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
    fetchExpensesHistory,
  )

  app.delete('/expenses/:id', { onRequest: [verifyJWT] }, deleteExpense)

  app.post('/categories', { onRequest: [verifyJWT] }, createCategory)

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

// TODO: Friday you will want implements factories from deletes use cases and controllers

// TODO: Create another methods of GET, DELETE, PUT for the incomes, categories and expanse
// Rest: PUT, GET (specific category, expense and income)

// TODO: create filters to fetch categories, expenses and incomes: created_at, update_at, value, name, category
// TODO: Implements history from category, expense and income-
// TODO: Finally create use case from monthly budget and balance
// TODO: Create E2E test

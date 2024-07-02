import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { fetchCategoriesHistory } from '../categories/fetch-categories-history'
import { createExpense } from '../expenses/create-expense'
import { deleteIncome } from './delete-income'

export async function incomesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/incomes', createExpense)

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
    },
    fetchCategoriesHistory,
  )

  app.delete('/incomes/:id', deleteIncome)
}

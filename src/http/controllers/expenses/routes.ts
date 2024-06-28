import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createExpense } from './create-expense'
import { deleteExpense } from './delete-expense'
import { fetchExpensesHistory } from './fetch-expenses-history'

export async function expensesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/expenses', createExpense)

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
    },
    fetchExpensesHistory,
  )

  app.delete('/expenses/:id', deleteExpense)
}

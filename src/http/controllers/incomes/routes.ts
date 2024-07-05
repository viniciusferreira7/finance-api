import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createIncome } from './create-income'
import { deleteIncome } from './delete-income'
import { fetchIncomesHistory } from './fetch-incomes-history'

export async function incomesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/incomes', createIncome)

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
    fetchIncomesHistory,
  )

  app.delete('/incomes/:id', deleteIncome)
}

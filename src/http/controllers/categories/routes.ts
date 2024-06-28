import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { deleteExpense } from '../expenses/delete-expense'
import { createCategory } from './create-category'
import { fetchCategoriesHistory } from './fetch-categories-history'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

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

  app.delete('/categories/:id', { onRequest: [verifyJWT] }, deleteExpense)
}

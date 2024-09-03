import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { getBalance } from './get-balance'

export async function balanceRoute(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get(
    '/balance',
    {
      schema: {
        summary: 'Get balance',
        description:
          'Return information about total of incomes, expense and balance',
        tags: ['Balance'],
        response: {
          200: {
            type: 'object',
            properties: {
              incomes_total: {
                type: 'number',
                description: 'The total sum of values of incomes',
                default: 0,
                nullable: false,
              },
              expenses_total: {
                type: 'number',
                description: 'The total sum of values of expenses',
                default: 0,
                nullable: false,
              },
              balance_total: {
                type: 'number',
                description: 'The balance',
                default: 0,
                nullable: false,
              },
            },
          },
          404: {
            description: 'Resource not found',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Resource not found',
                default: 'Resource not found',
              },
            },
          },
        },
      },
    },
    getBalance,
  )
}

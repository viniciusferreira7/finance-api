import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { getMetrics, getMetricsSearchParamsSchemaToJson } from './get-metrics'

export async function metricsRoute(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get(
    '/metrics',
    {
      schema: {
        summary: 'Get metrics',
        description: 'Returns metrics from incomes, expenses and categories',
        tags: ['Metrics'],
        security: [{ jwt: [] }],
        querystring: getMetricsSearchParamsSchemaToJson,
        response: {
          200: {
            type: 'object',
            properties: {
              monthly_financial_summary: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      description: 'The date in the format YYYY-MM',
                      example: '1999-01',
                    },
                    incomes_total: {
                      type: 'number',
                      description: 'Total income for the month',
                      example: 5000,
                    },
                    expenses_total: {
                      type: 'number',
                      description: 'Total expenses for the month',
                      example: 3000,
                    },
                  },
                  required: ['date', 'incomes_total', 'expenses_total'],
                },
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
          401: {
            description: 'Invalid credentials.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Invalid credentials.',
              },
            },
          },
          500: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    getMetrics,
  )
}

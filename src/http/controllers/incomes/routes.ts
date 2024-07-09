import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createIncome } from './create-income'
import { deleteIncome } from './delete-income'
import { fetchIncomesHistory } from './fetch-incomes-history'

export async function incomesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/incomes',
    {
      schema: {
        summary: 'Create an income',
        description: 'Create a new income for user',
        tags: ['Income'],
        security: [{ jwt: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of income' },
            value: { type: 'number', description: 'value of income' },
            description: {
              type: 'string',
              description: 'description of income (optional)',
            },
            category_id: {
              type: 'string',
              description: 'the category id associated with this income',
            },
          },
        },
        response: {
          201: {
            description: 'Income has been successfully created',
            type: 'null',
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
    createIncome,
  )

  app.get(
    '/incomes',
    {
      schema: {
        summary: 'Fetch incomes',
        description: 'Returns all incomes of user',
        tags: ['Income'],
        security: [{ jwt: [] }],
        querystring: {
          page: { type: 'number', default: 1, description: 'current page' },
          per_page: {
            type: 'number',
            default: 10,
            description: 'number of items per page',
          },
          pagination_disabled: {
            type: 'boolean',
            default: false,
            description: 'disable pagination',
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'total number of items on the list',
              },
              next: {
                type: 'number',
                description: 'next page',
                default: 2,
              },
              previous: {
                type: 'number',
                description: 'previous page',
                default: null,
              },
              page: {
                type: 'number',
                description: 'current page',
                default: 1,
              },
              total_pages: {
                type: 'number',
                description: 'total of pages',
                default: 5,
              },
              per_page: {
                type: 'number',
                description: 'number of items per page',
                default: 10,
              },
              pagination_disabled: {
                type: 'boolean',
                description: 'number of items per page',
                default: false,
              },
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    value: { type: 'string' },
                    description: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                    user_id: { type: 'string' },
                    category_id: { type: 'string' },
                    category: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        user_id: { type: 'string' },
                      },
                    },
                  },
                  required: [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                    'user_id',
                  ],
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
        },
      },
    },
    fetchIncomesHistory,
  )

  app.delete(
    '/incomes/:id',
    {
      schema: {
        summary: 'Delete an income',
        description: 'Delete an income by id',
        tags: ['Income'],
        security: [{ jwt: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'income id',
            },
          },
        },
        response: {
          204: {
            description: 'Income has been successfully deleted',
            type: 'null',
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
    deleteIncome,
  )
}

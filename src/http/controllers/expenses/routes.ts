import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createExpense } from './create-expense'
import { deleteExpense } from './delete-expense'
import { fetchExpensesHistory } from './fetch-expenses-history'
import { getExpense } from './get-expense'
import { updateExpense } from './update-expense'

export async function expensesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/expenses',
    {
      schema: {
        summary: 'Create an expense',
        description: 'Create a new expense for user',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of expense' },
            value: { type: 'number', description: 'value of expense' },
            description: {
              type: 'string',
              description: 'description of expense (optional)',
            },
            category_id: {
              type: 'string',
              description: 'the category id associated with this expense',
            },
          },
        },
        response: {
          201: {
            description: 'Expense has been successfully created',
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
    createExpense,
  )

  app.get(
    '/expenses',
    {
      schema: {
        summary: 'Fetch expenses',
        description: 'Returns all expenses of user',
        tags: ['Expense'],
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
    fetchExpensesHistory,
  )

  app.get(
    '/expenses/:id',
    {
      schema: {
        summary: 'Get expense',
        description: 'Returns a specific expense by id',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'expense id',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              value: { type: 'number' },
              description: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
              user_id: { type: 'string' },
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
    getExpense,
  )

  app.put(
    '/expenses/:id',
    {
      schema: {
        summary: 'Update an expense',
        description: 'Update an expense for user',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'expense id',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of expense (optional)' },
            value: {
              type: 'number',
              description: 'value of expense (optional)',
            },
            description: {
              type: 'string',
              description: 'description of expense (optional)',
            },
            category_id: {
              type: 'string',
              description:
                'the category id associated with this expense (optional)',
            },
          },
        },
        response: {
          204: {
            description: 'Expense has been successfully updated',
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
    updateExpense,
  )

  app.delete(
    '/expenses/:id',
    {
      schema: {
        summary: 'Delete an expense',
        description: 'Delete an expense by id',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'expense id',
            },
          },
        },
        response: {
          204: {
            description: 'Expense has been successfully deleted',
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
    deleteExpense,
  )
}

import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createExpense, expenseSchemaBodyToJson } from './create-expense'
import { deleteExpense, deleteExpenseBodySchemaToZod } from './delete-expense'
import {
  fetchExpenseHistories,
  fetchExpenseHistorieSearchParamsSchemaToJson,
  fetchExpenseHistoriesParamSchemaToJson,
} from './fetch-expense-histories'
import {
  fetchExpensesHistory,
  fetchExpensesSchemaToJson,
} from './fetch-expenses-history'
import { getExpense, getExpenseBodySchemaToJson } from './get-expense'
import { getMetricsMonthlyExpense } from './get-metrics-monthly-expense'
import {
  expenseSchemaParamsToJson,
  updatedExpenseSchemaBodyToJson,
  updateExpense,
} from './update-expense'

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
        body: expenseSchemaBodyToJson,
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
        querystring: fetchExpensesSchemaToJson,
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
                nullable: true,
              },
              previous: {
                type: 'number',
                description: 'previous page',
                default: null,
                nullable: true,
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
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
                    user_id: { type: 'string' },
                    category_id: { type: 'string' },
                    category: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string' },
                        updated_at: { type: 'string' },
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
    fetchExpensesHistory,
  )

  app.get(
    '/expense-histories/:id',
    {
      schema: {
        summary: 'Fetch expense histories',
        description: 'Returns all history of expense',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        params: fetchExpenseHistoriesParamSchemaToJson,
        querystring: fetchExpenseHistorieSearchParamsSchemaToJson,
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
                nullable: true,
              },
              previous: {
                type: 'number',
                description: 'previous page',
                default: null,
                nullable: true,
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
                    created_at: { type: 'string' },
                    user_id: { type: 'string' },
                    category_id: { type: 'string' },
                    category: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string' },
                        updated_at: { type: 'string' },
                        user_id: { type: 'string' },
                      },
                    },
                  },
                  required: ['id', 'name', 'created_at', 'user_id'],
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
    fetchExpenseHistories,
  )

  app.get(
    '/expenses/:id',
    {
      schema: {
        summary: 'Get expense',
        description: 'Returns a specific expense by id',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        params: getExpenseBodySchemaToJson,
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              value: { type: 'number' },
              description: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
              user_id: { type: 'string' },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  created_at: { type: 'string' },
                  updated_at: { type: 'string' },
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
        params: expenseSchemaParamsToJson,
        body: updatedExpenseSchemaBodyToJson,
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
        params: deleteExpenseBodySchemaToZod,
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
    deleteExpense,
  )

  app.get(
    '/expenses/metrics-monthly',
    {
      schema: {
        summary: 'Get metrics monthly',
        description: 'Returns a metrics of your expense',
        tags: ['Expense'],
        security: [{ jwt: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              amount: { type: 'number' },
              diff_from_last_month: { type: 'number' },
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
    getMetricsMonthlyExpense,
  )
}

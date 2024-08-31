import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createIncome, incomeSchemaBodyToJson } from './create-income'
import { deleteIncome, deleteIncomeBodySchemaToJson } from './delete-income'
import {
  fetchIncomeHistories,
  fetchIncomeHistorieSearchParamsSchemaToJson,
  fetchIncomeHistoriesParamSchemaToJson,
} from './fetch-income-histories'
import {
  fetchIncomesHistory,
  fetchIncomesSchemaToJson,
} from './fetch-incomes-history'
import { getIncome, getIncomeBodySchemaToJson } from './get-income'
import { getMetricsMonthlyIncome } from './get-metrics-monthly-income'
import {
  incomeSchemaBodyToZod,
  incomeSchemaParamsToJson,
  updateIncome,
} from './update-income'

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
        body: incomeSchemaBodyToJson,
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
        querystring: fetchIncomesSchemaToJson,
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
        },
      },
    },
    fetchIncomesHistory,
  )

  app.get(
    '/income-histories/:id',
    {
      schema: {
        summary: 'Fetch income histories',
        description: 'Returns all history of income',
        tags: ['Income'],
        security: [{ jwt: [] }],
        params: fetchIncomeHistoriesParamSchemaToJson,
        querystring: fetchIncomeHistorieSearchParamsSchemaToJson,
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
        },
      },
    },
    fetchIncomeHistories,
  )

  app.get(
    '/incomes/:id',
    {
      schema: {
        summary: 'Get income',
        description: 'Returns a specific income by id',
        tags: ['Income'],
        security: [{ jwt: [] }],
        params: getIncomeBodySchemaToJson,
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
        },
      },
    },
    getIncome,
  )

  app.put(
    '/incomes/:id',
    {
      schema: {
        summary: 'Update an income',
        description: 'Update a income for user',
        tags: ['Income'],
        security: [{ jwt: [] }],
        params: incomeSchemaParamsToJson,
        body: incomeSchemaBodyToZod,
        response: {
          204: {
            description: 'Income has been successfully updated',
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
    updateIncome,
  )

  app.delete(
    '/incomes/:id',
    {
      schema: {
        summary: 'Delete an income',
        description: 'Delete an income by id',
        tags: ['Income'],
        security: [{ jwt: [] }],
        params: deleteIncomeBodySchemaToJson,
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

  app.get(
    '/incomes/metrics-monthly',
    {
      schema: {
        summary: 'Get metrics monthly',
        description: 'Returns a metrics of your income',
        tags: ['Income'],
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
        },
      },
    },
    getMetricsMonthlyIncome,
  )
}

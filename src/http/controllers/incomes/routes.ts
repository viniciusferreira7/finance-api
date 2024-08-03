import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { createIncome } from './create-income'
import { deleteIncome } from './delete-income'
import { fetchIncomeHistories } from './fetch-income-histories'
import { fetchIncomesHistory } from './fetch-incomes-history'
import { getIncome } from './get-income'
import { updateIncome } from './update-income'

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
          name: {
            type: 'string',
            maxLength: 40,
            description: 'Name of the income, must be 40 characters or less',
            nullable: true,
          },
          value: {
            type: 'number',
            description: 'Value of the income, must be a positive number',
            nullable: true,
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Sort order',
          },
          created_at_from: {
            type: 'string',
            format: 'date-time',
            description:
              'Start date for created_at filter, must be a valid date',
            nullable: true,
          },
          created_at_to: {
            type: 'string',
            format: 'date-time',
            description: 'End date for created_at filter, must be a valid date',
            nullable: true,
          },
          updated_at_from: {
            type: 'string',
            format: 'date-time',
            description:
              'Start date for updated_at filter, must be a valid date',
            nullable: true,
          },
          updated_at_to: {
            type: 'string',
            format: 'date-time',
            description: 'End date for updated_at filter, must be a valid date',
            nullable: true,
          },
          category_id: {
            type: 'string',
            description: 'Category ID of the income',
            nullable: true,
          },
          page: {
            type: 'number',
            default: 1,
            description: 'Current page number',
          },
          per_page: {
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
          pagination_disabled: {
            type: 'boolean',
            default: false,
            description: 'Disable pagination',
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

  app.get(
    '/income-histories/:id',
    {
      schema: {
        summary: 'Fetch income histories',
        description: 'Returns all history of income',
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
        querystring: {
          name: {
            type: 'string',
            maxLength: 40,
            description: 'Name of the income, must be 40 characters or less',
            nullable: true,
          },
          value: {
            type: 'number',
            description: 'Value of the income, must be a positive number',
            nullable: true,
          },
          sort: {
            type: 'string',
            enum: ['asc', 'desc'],
            description: 'Sort order',
          },
          created_at_from: {
            type: 'string',
            format: 'date-time',
            description:
              'Start date for created_at filter, must be a valid date',
            nullable: true,
          },
          created_at_to: {
            type: 'string',
            format: 'date-time',
            description: 'End date for created_at filter, must be a valid date',
            nullable: true,
          },
          category_id: {
            type: 'string',
            description: 'Category ID of the income',
            nullable: true,
          },
          page: {
            type: 'number',
            default: 1,
            description: 'Current page number',
          },
          per_page: {
            type: 'number',
            default: 10,
            description: 'Number of items per page',
          },
          pagination_disabled: {
            type: 'boolean',
            default: false,
            description: 'Disable pagination',
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
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'income id',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of income (optional)' },
            value: {
              type: 'number',
              description: 'value of income (optional)',
            },
            description: {
              type: 'string',
              description: 'description of income (optional)',
            },
            category_id: {
              type: 'string',
              description:
                'the category id associated with this income (optional)',
            },
          },
        },
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

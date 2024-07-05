import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { deleteExpense } from '../expenses/delete-expense'
import { createCategory } from './create-category'
import { fetchCategoriesHistory } from './fetch-categories-history'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/categories',
    {
      onRequest: [verifyJWT],
      schema: {
        summary: 'Create a category',
        description: 'Create a new category for user',
        tags: ['Category'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: {
              type: 'string',
            },
          },
        },
        response: {
          201: {
            description: 'Category has been successfully created',
            type: 'null',
          },
          404: {
            description: 'Resource not found',
            type: 'null',
          },
        },
      },
    },
    createCategory,
  )

  app.get(
    '/categories',
    {
      schema: {
        summary: 'Fetch categories',
        description: 'returns all categories of user',
        tags: ['Category'],
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
                    description: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' },
                    user_id: { type: 'string' },
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
            type: 'null',
          },
        },
      },
    },
    fetchCategoriesHistory,
  )

  app.delete(
    '/categories/:id',
    {
      schema: {
        summary: 'Delete category',
        description: 'Delete a category by id',
        tags: ['Category'],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'category id',
            },
          },
        },
        response: {
          204: {
            description: 'Category has been successfully deleted',
            type: 'null',
          },
          404: {
            description: 'Resource not found',
            type: 'null',
          },
        },
      },
    },
    deleteExpense,
  )
}

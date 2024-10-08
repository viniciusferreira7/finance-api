import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { categorySchemaBodyToJson, createCategory } from './create-category'
import {
  deleteCategory,
  deleteCategoryBodySchemaToJson,
} from './delete-category'
import {
  fetchCategoriesHistory,
  fetchCategoriesSchemaToJson,
} from './fetch-categories-history'
import { getCategory, getCategoryBodySchemaToJson } from './get-category'
import {
  updateCategory,
  updateCategorySchemaBodyToJson,
  updateCategorySchemaParamsToJson,
} from './update-category'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/categories',
    {
      schema: {
        summary: 'Create a category',
        description: 'Create a new category for user',
        tags: ['Category'],
        security: [{ jwt: [] }],
        body: categorySchemaBodyToJson,
        response: {
          201: {
            description: 'Category has been successfully created',
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
          400: {
            description: 'Category already exist',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Category already exist',
                default: 'Category already exist',
              },
            },
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
        description: 'Returns all categories of user',
        tags: ['Category'],
        security: [{ jwt: [] }],
        querystring: fetchCategoriesSchemaToJson,
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
                    description: { type: 'string' },
                    created_at: { type: 'string' },
                    updated_at: { type: 'string' },
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
    fetchCategoriesHistory,
  )

  app.get(
    '/categories/:id',
    {
      schema: {
        summary: 'Get category',
        description: 'Returns a specific category by id',
        tags: ['Category'],
        security: [{ jwt: [] }],
        params: getCategoryBodySchemaToJson,
        response: {
          200: {
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
    getCategory,
  )

  app.put(
    '/categories/:id',
    {
      schema: {
        summary: 'Update a category',
        description: 'Update a category for user',
        tags: ['Category'],
        security: [{ jwt: [] }],
        params: updateCategorySchemaParamsToJson,
        body: updateCategorySchemaBodyToJson,
        response: {
          204: {
            description: 'Category has been successfully updated',
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
    updateCategory,
  )

  app.delete(
    '/categories/:id',
    {
      schema: {
        summary: 'Delete category',
        description: 'Delete a category by id',
        tags: ['Category'],
        security: [{ jwt: [] }],
        params: deleteCategoryBodySchemaToJson,
        response: {
          204: {
            description: 'Category has been successfully deleted',
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
    deleteCategory,
  )
}

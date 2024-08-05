import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middleware/verify-jwt'

import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    {
      schema: {
        summary: 'Create a user',
        description: 'Create a new user',
        tags: ['User'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of user' },
            email: { type: 'string', description: 'email of user' },
            password: { type: 'string', description: 'password of user' },
          },
        },
        response: {
          201: {
            description: 'User has been successfully created',
            type: 'null',
          },
          409: {
            description: 'E-mail already exists',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'E-mail already exists',
                default: 'E-mail already exists',
              },
            },
          },
        },
      },
    },
    register,
  )

  app.post(
    '/sessions',
    {
      schema: {
        summary: 'Create a session',
        description: 'Create a new session for user',
        tags: ['User'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'name of user' },
            email: { type: 'string', description: 'email of user' },
          },
        },
        response: {
          201: {
            description: 'Session has been successfully created',
            type: 'null',
          },
          409: {
            description: 'Invalid credentials.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Invalid credentials.',
                default: 'Invalid credentials.',
              },
            },
          },
        },
      },
    },
    authenticate,
  )

  // Authenticate
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        summary: 'Get profile',
        description: 'Get profile of user',
        security: [{ jwt: [] }],
        tags: ['User'],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              created_at: { type: 'string' },
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
    profile,
  )
}

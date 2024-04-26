import fastify from 'fastify'
import { AppRoutes } from './http/controllers/routes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(AppRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', issue: error.format() })
  }

  return reply.status(500).send(error)
})

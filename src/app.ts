import fastifyJwt from '@fastify/jwt'
import fastifyScalar from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { categoriesRoutes } from './http/controllers/categories/routes'
import { expensesRoutes } from './http/controllers/expenses/routes'
import { incomesRoutes } from './http/controllers/incomes/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { swagger } from './lib/swagger'

export const app = fastify()

swagger(app)

app.register(fastifyScalar, {
  routePrefix: '/reference',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(incomesRoutes)
app.register(expensesRoutes)
app.register(categoriesRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    console.log({ issue: JSON.stringify(error.format()) })
    reply
      .status(400)
      .send({ message: 'Validation error.', issue: error.format() })
  }

  return reply.status(500).send(error)
})

// TODO: Create another methods of GET, DELETE, PUT for the incomes, categories and expanse
// Rest: PUT, GET (specific category, expense and income)

// TODO: create filters to fetch categories, expenses and incomes: created_at, updated_at, value, name, category
// TODO: Implements history from category, expense and income-
// TODO: Finally create use case from monthly budget and balance
// TODO: Create E2E test

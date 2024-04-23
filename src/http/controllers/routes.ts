import { FastifyInstance } from 'fastify'
import { register } from './register'

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
}

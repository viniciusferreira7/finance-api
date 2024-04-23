import fastify from 'fastify'
import { AppRoutes } from './http/controllers/routes'

export const app = fastify()

app.register(AppRoutes)

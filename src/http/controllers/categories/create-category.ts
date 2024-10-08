import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { CategoryAlreadyExistError } from '@/use-cases/error/category-already-exist-error'
import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeCreateCategory } from '@/use-cases/factories/categories/make-create-category'

const categorySchemaBody = z.object({
  name: z
    .string()
    .min(1, 'Mut be at least 1 character')
    .max(40, 'Must be 40 characters.'),
  description: z.string().max(220, 'Must be 220 characters.').optional(),
})

export const categorySchemaBodyToJson = zodToJsonSchema(categorySchemaBody)

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, description } = categorySchemaBody.parse(request.body)

  try {
    const createCategoryUseCase = makeCreateCategory()

    await createCategoryUseCase.execute({
      name,
      description: description ?? null,
      userId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof CategoryAlreadyExistError) {
      return reply.status(400).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}

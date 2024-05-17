import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { CategoryAlreadyExistError } from '@/use-cases/error/category-already-exist-error'
import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeCreateCategory } from '@/use-cases/factories/make-create-category'

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const categorySchemaBody = z.object({
    name: z.string(),
    description: z.string().optional(),
    iconName: z.string().optional(),
  })

  const { name, description, iconName } = categorySchemaBody.parse(request.body)

  try {
    const createCategoryUseCase = makeCreateCategory()

    await createCategoryUseCase.execute({
      name,
      description: description ?? null,
      iconName: iconName ?? null,
      userId: request.user.sub,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof CategoryAlreadyExistError) {
      return reply.status(404).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}

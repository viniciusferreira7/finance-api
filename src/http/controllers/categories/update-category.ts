import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { CategoryAlreadyExistError } from '@/use-cases/error/category-already-exist-error'
import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeUpdateUserCategory } from '@/use-cases/factories/categories/make-update-user-category'

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const categorySchemaParams = z.object({
    id: z.string(),
  })

  const categorySchemaBody = z.object({
    name: z
      .string()
      .min(1, 'Mut be at least 1 character')
      .max(40, 'Must be 40 characters.')
      .optional(),
    description: z
      .string()
      .max(220, 'Must be 220 characters.')
      .optional()
      .optional(),
  })

  const { id } = categorySchemaParams.parse(request.params)

  const { name, description } = categorySchemaBody.parse(request.body)

  try {
    const updateUserCategoryUseCase = makeUpdateUserCategory()

    await updateUserCategoryUseCase.execute({
      userId: request.user.sub,
      category: {
        id,
        name,
        description,
      },
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
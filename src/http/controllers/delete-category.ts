import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeDeleteUserCategory } from '@/use-cases/factories/make-delete-user-category'

const deleteCategoryBodySchema = z.object({
  id: z.string(),
})

export async function deleteCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteCategoryBodySchema.parse(request.params)

  try {
    const deleteUserCategory = makeDeleteUserCategory()

    await deleteUserCategory.execute({
      userId: request.user.sub,
      categoryId: id,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

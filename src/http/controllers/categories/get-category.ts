import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetUserCategory } from '@/use-cases/factories/categories/make-get-use-category'

const getCategoryBodySchema = z.object({
  id: z.string(),
})

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getCategoryBodySchema.parse(request.params)

  try {
    const getUserCategory = makeGetUserCategory()

    const { category } = await getUserCategory.execute({
      userId: request.user.sub,
      categoryId: id,
    })

    return reply.status(200).send(category)
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

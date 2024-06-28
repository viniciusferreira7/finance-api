import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserCategoriesHistory } from '@/use-cases/factories/make-fetch-user-categories-history'

export async function fetchCategoriesHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCategoriesSchema = z.object({
    page: z.coerce
      .number()
      .positive({ message: 'Must be the positive number.' })
      .default(1)
      .optional(),
    per_page: z.coerce
      .number()
      .positive({ message: 'Must be the positive number.' })
      .default(1)
      .optional(),
    pagination_disabled: z.coerce.boolean().default(false).optional(),
  })

  const { page, per_page, pagination_disabled } = fetchCategoriesSchema.parse(
    request.query,
  )

  try {
    const fetchUserCategoriesHistoryUseCase = makeFetchUserCategoriesHistory()

    const history = await fetchUserCategoriesHistoryUseCase.execute({
      userId: request.user.sub,
      page,
      per_page,
      pagination_disabled,
    })

    return reply.status(200).send(history)
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

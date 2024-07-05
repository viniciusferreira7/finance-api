import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserIncomesHistory } from '@/use-cases/factories/incomes/make-fetch-user-incomes-history'

export async function fetchIncomesHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchIncomesSchema = z.object({
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
    pagination_disabled: z
      .union([z.string(), z.boolean()])
      .transform((val) => {
        if (typeof val === 'boolean') return val
        return val === 'true'
      })
      .default(false)
      .optional(),
  })

  const { page, per_page, pagination_disabled } = fetchIncomesSchema.parse(
    request.query,
  )

  try {
    const fetchUserIncomesHistoryUseCase = makeFetchUserIncomesHistory()

    const history = await fetchUserIncomesHistoryUseCase.execute({
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

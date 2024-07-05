import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserExpensesHistory } from '@/use-cases/factories/expenses/make-fetch-user-expenses-history'

export async function fetchExpensesHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchExpensesSchema = z.object({
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

  const { page, per_page, pagination_disabled } = fetchExpensesSchema.parse(
    request.query,
  )

  try {
    const fetchUserExpensesHistoryUseCase = makeFetchUserExpensesHistory()

    const history = await fetchUserExpensesHistoryUseCase.execute({
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

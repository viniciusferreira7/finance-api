import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeDeleteUserIncome } from '@/use-cases/factories/make-delete-user-income'

const deleteIncomeBodySchema = z.object({
  id: z.string(),
})

export async function deleteIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteIncomeBodySchema.parse(request.params)

  try {
    const deleteUserIncome = makeDeleteUserIncome()

    await deleteUserIncome.execute({
      userId: request.user.sub,
      incomeId: id,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

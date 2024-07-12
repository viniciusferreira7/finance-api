import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetUserIncome } from '@/use-cases/factories/incomes/make-get-user-income'

const getIncomeBodySchema = z.object({
  id: z.string(),
})

export async function getIncome(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getIncomeBodySchema.parse(request.params)

  try {
    const getUserIncome = makeGetUserIncome()

    const income = await getUserIncome.execute({
      userId: request.user.sub,
      incomeId: id,
    })

    return reply.status(200).send({ income })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

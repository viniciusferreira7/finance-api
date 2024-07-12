import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetUserExpense } from '@/use-cases/factories/expenses/make-get-user-expense'

const getExpenseBodySchema = z.object({
  id: z.string(),
})

export async function getExpense(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getExpenseBodySchema.parse(request.params)

  try {
    const getUserExpense = makeGetUserExpense()

    const expense = await getUserExpense.execute({
      userId: request.user.sub,
      expenseId: id,
    })

    return reply.status(200).send({ expense })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

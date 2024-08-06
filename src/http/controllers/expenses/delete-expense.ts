import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeDeleteUserExpense } from '@/use-cases/factories/expenses/make-delete-user-expense'

const deleteExpenseBodySchema = z.object({
  id: z.string(),
})

export const deleteExpenseBodySchemaToZod = zodToJsonSchema(
  deleteExpenseBodySchema,
)

export async function deleteExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteExpenseBodySchema.parse(request.params)

  try {
    const deleteUserExpense = makeDeleteUserExpense()

    await deleteUserExpense.execute({
      userId: request.user.sub,
      expenseId: id,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

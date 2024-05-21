import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeCreateExpenseUseCase } from '@/use-cases/factories/make-create-expense-use-case'

export async function createExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const expenseSchemaBody = z.object({
    value: z.number().positive({ message: 'Must be the positive number.' }),
    description: z.string(),
    category_id: z.string(),
  })

  const { value, description, category_id } = expenseSchemaBody.parse(
    request.body,
  )

  try {
    const createExpenseUseCase = makeCreateExpenseUseCase()

    createExpenseUseCase.execute({
      value,
      description,
      category_id,
      user_id: request.user.sub,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}

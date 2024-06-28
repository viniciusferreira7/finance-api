import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeCreateExpenseUseCase } from '@/use-cases/factories/expenses/make-create-expense-use-case'

export async function createExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const expenseSchemaBody = z.object({
    name: z
      .string()
      .min(1, 'Mut be at least 1 character')
      .max(40, 'Must be 40 characters.'),
    value: z.number().positive({ message: 'Must be the positive number.' }),
    description: z.string().max(220, 'Must be 220 characters.').optional(),
    category_id: z.string(),
  })

  const { name, value, description, category_id } = expenseSchemaBody.parse(
    request.body,
  )

  try {
    const createExpenseUseCase = makeCreateExpenseUseCase()

    createExpenseUseCase.execute({
      name,
      value,
      description: description ?? null,
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

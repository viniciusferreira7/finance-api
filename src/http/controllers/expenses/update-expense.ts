import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeUpdateUserExpenseUseCase } from '@/use-cases/factories/expenses/make-update-user-expense'

const expenseSchemaParams = z.object({
  id: z.string(),
})

export const expenseSchemaParamsToJson = zodToJsonSchema(expenseSchemaParams)

const expenseSchemaBody = z.object({
  name: z
    .string()
    .min(1, 'Mut be at least 1 character')
    .max(40, 'Must be 40 characters.')
    .optional(),
  value: z
    .number()
    .positive({ message: 'Must be the positive number.' })
    .optional(),
  description: z.string().max(220, 'Must be 220 characters.').optional(),
  category_id: z.string().optional(),
})

export const updatedExpenseSchemaBodyToJson = zodToJsonSchema(expenseSchemaBody)

export async function updateExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = expenseSchemaParams.parse(request.params)

  const { name, value, description, category_id } = expenseSchemaBody.parse(
    request.body,
  )

  try {
    const updateUserExpenseUseCase = makeUpdateUserExpenseUseCase()

    await updateUserExpenseUseCase.execute({
      userId: request.user.sub,
      updateExpense: {
        id,
        name,
        value: value?.toString(),
        description: description ?? null,
        categoryId: category_id,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }

  return reply.status(204).send()
}

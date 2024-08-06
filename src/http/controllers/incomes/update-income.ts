import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeUpdateUserIncomeUseCase } from '@/use-cases/factories/incomes/make-update-user-income'

const incomeSchemaParams = z.object({
  id: z.string(),
})

export const incomeSchemaParamsToJson = zodToJsonSchema(incomeSchemaParams)

const incomeSchemaBody = z.object({
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

export const incomeSchemaBodyToZod = zodToJsonSchema(incomeSchemaBody)

export async function updateIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = incomeSchemaParams.parse(request.params)

  const { name, value, description, category_id } = incomeSchemaBody.parse(
    request.body,
  )

  try {
    const updateUserIncomeUseCase = makeUpdateUserIncomeUseCase()

    await updateUserIncomeUseCase.execute({
      userId: request.user.sub,
      updateIncome: {
        id,
        name,
        value,
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

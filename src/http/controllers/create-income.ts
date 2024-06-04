import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeCreateIncomeUseCase } from '@/use-cases/factories/make-create-income-use-case'

export async function createIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const incomeSchemaBody = z.object({
    value: z.number().positive({ message: 'Must be the positive number.' }),
    description: z.string().max(220, 'Must be 220 characters.').optional(),
    category_id: z.string(),
  })

  const { value, description, category_id } = incomeSchemaBody.parse(
    request.body,
  )

  try {
    const createIncomeUseCase = makeCreateIncomeUseCase()

    createIncomeUseCase.execute({
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

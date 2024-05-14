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
    description: z.string(),
    category_id: z.string(),
  })

  const { value, description, category_id } = incomeSchemaBody.parse(
    request.body,
  )

  try {
    const createIncome = makeCreateIncomeUseCase()

    createIncome.execute({
      value,
      description,
      category_id,
      user_id: request.user.sub,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

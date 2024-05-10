import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserAlreadyExists } from '@/use-cases/error/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: 'The password must contain at least 6 characters.' }),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExists) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/error/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: 'The password must contain at least 6 characters.' }),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(200).send()
  }
}

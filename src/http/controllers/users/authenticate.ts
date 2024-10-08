import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { InvalidCredentialsError } from '@/use-cases/error/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/users/make-authenticate-use-case'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'The password must contain at least 6 characters.' }),
})

export const authenticateBodySchemaToJson = zodToJsonSchema(
  authenticateBodySchema,
)

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '2d',
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

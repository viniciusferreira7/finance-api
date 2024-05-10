import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase()

  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    ...user,
    password_hash: undefined,
  })
}

import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/users/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()

    const { user } = await getUserProfileUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      ...user,
      password_hash: undefined,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

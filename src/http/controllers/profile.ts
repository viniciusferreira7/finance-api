import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUserCase } from '@/use-cases/get-user-profile'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUserCase(usersRepository)

  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    ...user,
    password_hash: undefined,
  })
}

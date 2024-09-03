import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetBalance } from '@/use-cases/factories/balance/make-get-balance'

export async function getBalance(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getBalanceUseCase = makeGetBalance()

    const metrics = await getBalanceUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({
      incomes_total: metrics.incomes_total,
      expense_total: metrics.expense_total,
      balance_total: metrics.balance_total,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ mensagem: err.message })
    }
  }
}

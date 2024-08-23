import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetMetricsMonthlyIncome } from '@/use-cases/factories/incomes/make-get-metrics-monthly-income'

export async function getMetricsMonthlyIncome(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getMetricsMonthlyIncomeUseCase = makeGetMetricsMonthlyIncome()

    const { amount, diff_from_last_month } =
      await getMetricsMonthlyIncomeUseCase.execute({
        userId: request.user.sub,
      })

    return reply.status(200).send({ amount, diff_from_last_month })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

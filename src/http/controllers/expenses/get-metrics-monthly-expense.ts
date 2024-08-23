import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetMetricsMonthlyExpense } from '@/use-cases/factories/expenses/make-get-metrics-monthly-expense'

export async function getMetricsMonthlyExpense(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getMetricsMonthlyExpenseUseCase = makeGetMetricsMonthlyExpense()

    const { amount, diff_from_last_month } =
      await getMetricsMonthlyExpenseUseCase.execute({
        userId: request.user.sub,
      })

    return reply.status(200).send({ amount, diff_from_last_month })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

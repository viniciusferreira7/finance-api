import dayjs from 'dayjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetMonthlyFinancialSummary } from '@/use-cases/factories/metrics/make-get-monthly-financial-summary'

const getMetricsSearchParamsSchema = z.object({
  end_date: z
    .string()
    .refine((value) => dayjs(value).isValid(), 'Invalid date')
    .optional(),
})

export const getMetricsSearchParamsSchemaToJson = zodToJsonSchema(
  getMetricsSearchParamsSchema,
)

export async function getMetrics(request: FastifyRequest, reply: FastifyReply) {
  const searchParams = getMetricsSearchParamsSchema.parse(request.query)

  try {
    const getMonthlyFinancialSummaryUseCase = makeGetMonthlyFinancialSummary()

    const monthlyFinancialSummary =
      await getMonthlyFinancialSummaryUseCase.execute({
        userId: request.user.sub,
        endDate: searchParams.end_date,
      })

    return reply.status(200).send({
      monthly_financial_summary: monthlyFinancialSummary,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}
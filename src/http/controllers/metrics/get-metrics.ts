import dayjs from 'dayjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeGetBiggestExpensesUseCase } from '@/use-cases/factories/metrics/make-get-biggest-expenses'
import { makeGetCategoriesWithTheMostRecordUseCase } from '@/use-cases/factories/metrics/make-get-categories-with-the-most-record'
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
    const getCategoriesWithTheMostRecordUseCase =
      makeGetCategoriesWithTheMostRecordUseCase()

    const getBiggestExpenses = makeGetBiggestExpensesUseCase()

    const [
      monthlyFinancialSummary,
      categoriesWithMostRecords,
      biggestExpenses,
    ] = await Promise.all([
      getMonthlyFinancialSummaryUseCase.execute({
        userId: request.user.sub,
        endDate: searchParams.end_date,
      }),
      getCategoriesWithTheMostRecordUseCase.execute({
        userId: request.user.sub,
      }),
      getBiggestExpenses.execute({
        userId: request.user.sub,
        endDate: searchParams.end_date,
      }),
    ])

    return reply.status(200).send({
      monthly_financial_summary: monthlyFinancialSummary,
      categories_with_most_records: categoriesWithMostRecords,
      biggest_expenses: biggestExpenses,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

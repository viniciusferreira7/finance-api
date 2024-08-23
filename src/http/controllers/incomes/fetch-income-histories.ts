import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserIncomeHistories } from '@/use-cases/factories/incomes/make-fetch-user-income-histories'

const fetchIncomeHistoriesParamSchema = z.object({
  id: z.string(),
})

export const fetchIncomeHistoriesParamSchemaToJson = zodToJsonSchema(
  fetchIncomeHistoriesParamSchema,
)

const fetchIncomeHistorieSearchParamsSchema = z
  .object({
    name: z.string().max(40, 'Must be 40 characters.').optional(),
    value: z.coerce
      .number()
      .positive({ message: 'Must be the positive number.' })
      .optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    created_at_from: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
    created_at_to: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
    category_id: z.string().optional(),
    page: z.coerce
      .number()
      .positive({ message: 'Must be the positive number.' })
      .default(1)
      .optional(),
    per_page: z.coerce
      .number()
      .positive({ message: 'Must be the positive number.' })
      .default(1)
      .optional(),
    pagination_disabled: z
      .union([z.string(), z.boolean()])
      .transform((val) => {
        if (typeof val === 'boolean') return val
        return val === 'true'
      })
      .default(false)
      .optional(),
  })
  .superRefine((field, ctx) => {
    if (!field.created_at_from && field.created_at_to) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Invalid date',
      })
    }
  })

export const fetchIncomeHistorieSearchParamsSchemaToJson = zodToJsonSchema(
  fetchIncomeHistorieSearchParamsSchema,
)

export async function fetchIncomeHistories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = fetchIncomeHistoriesParamSchema.parse(request.params)

  const {
    name,
    value,
    category_id,
    created_at_from,
    created_at_to,
    page,
    per_page,
    pagination_disabled,
    sort,
  } = fetchIncomeHistorieSearchParamsSchema.parse(request.query)

  try {
    const fetchUserIncomeHistoriesUseCase = makeFetchUserIncomeHistories()

    const history = await fetchUserIncomeHistoriesUseCase.execute({
      userId: request.user.sub,
      incomeId: id,
      searchParams: {
        name,
        value: value ? value.toString() : undefined,
        categoryId: category_id,
        createdAt: {
          from: created_at_from,
          to: created_at_to,
        },
        page,
        per_page,
        pagination_disabled,
        sort,
      },
    })

    return reply.status(200).send(history)
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}

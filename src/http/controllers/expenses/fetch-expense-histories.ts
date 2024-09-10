import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserExpenseHistories } from '@/use-cases/factories/expenses/make-fetch-user-expense-histories'

const fetchExpenseHistoriesParamSchema = z.object({
  id: z.string(),
})

export const fetchExpenseHistoriesParamSchemaToJson = zodToJsonSchema(
  fetchExpenseHistoriesParamSchema,
)

const fetchExpenseHistorieSearchParamsSchema = z
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
      .default(10)
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

export const fetchExpenseHistorieSearchParamsSchemaToJson = zodToJsonSchema(
  fetchExpenseHistorieSearchParamsSchema,
)

export async function fetchExpenseHistories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = fetchExpenseHistoriesParamSchema.parse(request.params)

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
  } = fetchExpenseHistorieSearchParamsSchema.parse(request.query)

  try {
    const fetchUserExpenseHistoriesUseCase = makeFetchUserExpenseHistories()

    const history = await fetchUserExpenseHistoriesUseCase.execute({
      userId: request.user.sub,
      expenseId: id,
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

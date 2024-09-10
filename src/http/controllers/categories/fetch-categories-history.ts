import dayjs from 'dayjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { ResourceNotFound } from '@/use-cases/error/resource-not-found-error'
import { makeFetchUserCategoriesHistory } from '@/use-cases/factories/categories/make-fetch-user-categories-history'

const fetchCategoriesSchema = z
  .object({
    name: z.string().max(40, 'Must be 40 characters.').optional(),
    description: z.string().max(220, 'Must be 220 characters.').optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    created_at_from: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
    created_at_to: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
    updated_at_from: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
    updated_at_to: z
      .string()
      .refine((value) => dayjs(value).isValid(), 'Invalid date')
      .optional(),
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
    if (!field.updated_at_from && field.updated_at_to) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Invalid date',
      })
    }
  })

export const fetchCategoriesSchemaToJson = zodToJsonSchema(
  fetchCategoriesSchema,
)

export async function fetchCategoriesHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    name,
    description,
    created_at_from,
    created_at_to,
    updated_at_from,
    updated_at_to,
    page,
    per_page,
    pagination_disabled,
    sort,
  } = fetchCategoriesSchema.parse(request.query)

  try {
    const fetchUserCategoriesHistoryUseCase = makeFetchUserCategoriesHistory()

    const history = await fetchUserCategoriesHistoryUseCase.execute({
      userId: request.user.sub,
      searchParams: {
        name,
        description,
        createdAt: {
          from: created_at_from,
          to: created_at_to,
        },
        updatedAt: {
          from: updated_at_from,
          to: updated_at_to,
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

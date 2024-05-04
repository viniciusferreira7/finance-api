// import { FastifyReply, FastifyRequest } from 'fastify'
// import { z } from 'zod'

// export async function createIncome(
//   request: FastifyRequest,
//   reply: FastifyReply,
// ) {
//   const incomeSchemaBody = z.object({
//     value: z.number().positive({ message: 'Must be the positive number.' }),
//     description: z.string(),
//     category_id: z.string(),
//   })

//   const { value, description, category_id } = incomeSchemaBody.parse(
//     request.body,
//   )

// }

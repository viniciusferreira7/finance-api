import { z } from 'zod'

const envSchema = z.object({
  NODE_END: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  SEND_API_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw Error('Invalid environment variables')
}

export const env = _env.data

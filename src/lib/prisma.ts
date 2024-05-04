import { PrismaClient } from '@prisma/client'

import { env } from '@/env'

export const prisma = new PrismaClient({
  log: env.NODE_END === 'dev' ? ['query', 'error', 'warn', 'info'] : [],
})

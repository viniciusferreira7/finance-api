import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_END === 'dev' ? ['query', 'error', 'warn', 'info'] : [],
})

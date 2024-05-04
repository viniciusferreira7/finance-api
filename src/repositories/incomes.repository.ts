import { Income, Prisma } from '@prisma/client'

export interface IncomeRepository {
  create(data: Prisma.IncomeCreateInput): Promise<Income>
}

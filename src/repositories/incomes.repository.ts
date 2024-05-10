import { Income, Prisma } from '@prisma/client'

export interface IncomeRepository {
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

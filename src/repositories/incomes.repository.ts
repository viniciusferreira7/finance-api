import { Income, Prisma } from '@prisma/client'

export interface IncomesRepository {
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

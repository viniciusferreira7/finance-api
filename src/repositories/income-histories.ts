import { IncomeHistory, Prisma } from '@prisma/client'

export interface IncomeHistories {
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

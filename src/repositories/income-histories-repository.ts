import { IncomeHistory, Prisma } from '@prisma/client'

export interface IncomeHistories {
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

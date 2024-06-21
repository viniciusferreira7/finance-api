import { IncomeHistory, Prisma } from '@prisma/client'

export interface IncomeHistoriesRepository {
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

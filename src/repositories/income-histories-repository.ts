import { IncomeHistory, Prisma } from '@prisma/client'

export interface IncomeHistoriesRepository {
  updateManyByCategoryId(categoryId: string): Promise<number>
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(data: Prisma.IncomeHistoryUncheckedCreateInput): Promise<IncomeHistory>
}

import { Income, Prisma } from '@prisma/client'

export interface IncomesRepository {
  findManyByUserId(userId: string, page: number): Promise<Income[]>
  create(data: Prisma.IncomeUncheckedCreateInput): Promise<Income>
}

export interface ExpenseHistoriesRepository {
  deleteMany(incomeId: string, userId: string): Promise<number>
  create(
    data: Prisma.ExpenseHistoryUncheckedCreateInput,
  ): Promise<ExpenseHistory>
}

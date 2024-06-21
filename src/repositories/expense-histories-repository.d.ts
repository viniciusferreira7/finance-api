export interface ExpenseHistoriesRepository {
  deleteMany(expenseId: string, userId: string): Promise<number>
  create(
    data: Prisma.ExpenseHistoryUncheckedCreateInput,
  ): Promise<ExpenseHistory>
}

export interface ExpenseHistoriesRepository {
  updateManyByCategoryId(categoryId: string): Promise<number>
  deleteMany(expenseId: string, userId: string): Promise<number>
  create(
    data: Prisma.ExpenseHistoryUncheckedCreateInput,
  ): Promise<ExpenseHistory>
}

interface GetBalance {
  incomes_total: number
  expenses_total: number
  balance_total: number
}

export interface BalanceRepository {
  getBalance(userId: string): Promise<GetBalance>
}

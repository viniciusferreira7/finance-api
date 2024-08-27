export interface BalanceRepository {
  getBalance(userId: string): Promise<number>
}

import { prisma } from '@/lib/prisma'
import { BalanceRepository } from '@/repositories/balance'

interface GetBalance {
  incomes_total: number
  expense_total: number
  balance_total: number
}

export class PrismaBalanceRepository implements BalanceRepository {
  async getBalance(userId: string) {
    const metrics = await prisma.$queryRaw<GetBalance>`
      WITH incomes_balance AS (
        SELECT SUM(CAST(value AS NUMERIC)) AS total
        FROM incomes
        WHERE user_id = ${userId}
      ), 
      expenses_balance AS (
        SELECT SUM(CAST(value AS NUMERIC)) AS total
        FROM expenses
        WHERE user_id = ${userId}
      )
      SELECT
        COALESCE(incomes.total, 0) AS incomes_total
        COALESCE(expenses.total, 0) AS expenses_total
        COALESCE(incomes_balance.total, 0) - COALESCE(expenses_balance.total, 0) AS balance
      FROM incomes_balance, expenses_balance  
      `
    return {
      incomes_total: metrics.incomes_total,
      expense_total: metrics.expense_total,
      balance_total: metrics.balance_total,
    }
  }
}

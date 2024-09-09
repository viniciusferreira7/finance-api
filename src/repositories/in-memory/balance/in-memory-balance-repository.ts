import { Expense, Income } from '@prisma/client'

import { BalanceRepository } from '@/repositories/balance'

export class InMemoryBalanceRepository implements BalanceRepository {
  public incomes: Income[] = []
  public expenses: Expense[] = []

  async getBalance(userId: string) {
    const incomesTotal = this.incomes
      .filter((item) => item.user_id === userId)
      .reduce((total, income) => total + Number(income.value), 0)

    const expensesTotal = this.expenses
      .filter((item) => item.user_id === userId)
      .reduce((total, income) => total + Number(income.value), 0)

    const balance = incomesTotal - expensesTotal

    return {
      incomes_total: incomesTotal,
      expenses_total: expensesTotal,
      balance_total: balance,
    }
  }
}

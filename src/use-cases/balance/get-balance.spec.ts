import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryBalanceRepository } from '@/repositories/in-memory/balance/in-memory-balance-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'
import { convertToCents } from '@/utils/convert-to-cents'

import { GetBalanceUseCase } from './get-balance'

let balanceRepository: InMemoryBalanceRepository
let usersRepository: InMemoryUsersRepository
let sut: GetBalanceUseCase

describe('Balance use case', () => {
  beforeEach(() => {
    balanceRepository = new InMemoryBalanceRepository()
    usersRepository = new InMemoryUsersRepository()

    sut = new GetBalanceUseCase(balanceRepository, usersRepository)
  })

  it('should be able to get the balance', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    async function generateIncomes() {
      for (let i = 1; i <= 200; i++) {
        const value = faker.helpers.arrayElement([
          convertToCents(
            Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
          ),
          convertToCents(
            Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
          ),
          convertToCents(
            Number(faker.finance.amount({ min: 10, max: 1_000_000 })),
          ),
        ])

        balanceRepository.incomes.push({
          id: randomUUID(),
          name: 'Job',
          value,
          description: 'Salary',
          category_id: `category-${i}-income`,
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    }

    async function generateExpenses() {
      for (let i = 1; i <= 200; i++) {
        const value = faker.helpers.arrayElement([
          convertToCents(Number(faker.finance.amount({ min: 10, max: 1_000 }))),
          convertToCents(Number(faker.finance.amount({ min: 10, max: 10 }))),
          convertToCents(Number(faker.finance.amount({ min: 10, max: 100 }))),
        ])

        balanceRepository.expenses.push({
          id: randomUUID(),
          name: 'Job',
          value,
          description: 'Salary',
          category_id: `category-${i}-expense`,
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    }

    await generateIncomes()
    await generateExpenses()

    const metrics = await sut.execute({
      userId: user.id,
    })

    expect(metrics.incomes_total).toEqual(expect.any(Number))
    expect(metrics.expense_total).toEqual(expect.any(Number))
    expect(metrics.balance_total).toEqual(expect.any(Number))
  })
})

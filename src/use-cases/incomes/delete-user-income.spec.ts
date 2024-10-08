import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryIncomeHistoriesRepository } from '@/repositories/in-memory/incomes/in-memory-income-histories-repository'
import { InMemoryIncomesRepository } from '@/repositories/in-memory/incomes/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { DeleteUserIncome } from './delete-user-income'

let incomesRepository: InMemoryIncomesRepository
let incomeHistoriesRepository: InMemoryIncomeHistoriesRepository
let usersRepository: InMemoryUsersRepository

let sut: DeleteUserIncome

describe('Delete user income use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    incomeHistoriesRepository = new InMemoryIncomeHistoriesRepository()
    incomesRepository = new InMemoryIncomesRepository()

    sut = new DeleteUserIncome(
      incomesRepository,
      incomeHistoriesRepository,
      usersRepository,
    )
  })

  it('should be able to delete an existing income', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      user_id: user.id,
      category_id: 'non-existing',
    })

    const { income: deletedIncome } = await sut.execute({
      userId: user.id,
      incomeId: income.id,
    })

    expect(deletedIncome?.id).toEqual(expect.any(String))
  })

  it('should not be able to delete an existing income without user', async () => {
    const income = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      user_id: 'user-1',
      category_id: 'non-existing',
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing',
        incomeId: income.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete an inexistent income', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        incomeId: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

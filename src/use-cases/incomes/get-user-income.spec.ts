import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryIncomesRepository } from '@/repositories/in-memory/incomes/in-memory-incomes-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users/in-memory-users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'
import { GetUserIncomeUseCase } from './get-user-income'

let incomesRepository: InMemoryIncomesRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserIncomeUseCase

describe('Get user income use case', () => {
  beforeEach(() => {
    incomesRepository = new InMemoryIncomesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserIncomeUseCase(incomesRepository, usersRepository)
  })

  it('should be able to get a specific income by id', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdIncome = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: 'category-01',
      user_id: user.id,
    })

    const { income } = await sut.execute({
      userId: user.id,
      incomeId: createdIncome.id,
    })

    expect(income).toEqual(
      expect.objectContaining({
        name: 'job',
        value: (1000).toString(),
        description: 'Salary',
        category_id: 'category-01',
        user_id: user.id,
      }),
    )
  })

  it('should not be able to get a specific income by id without a user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    const createdIncome = await incomesRepository.create({
      name: 'job',
      value: (1000).toString(),
      description: 'Salary',
      category_id: 'category-01',
      user_id: user.id,
    })

    await sut.execute({
      userId: user.id,
      incomeId: createdIncome.id,
    })

    await expect(() =>
      sut.execute({
        userId: 'non-exiting-id',
        incomeId: createdIncome.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to get a specific income by id without an existing income', async () => {
    const user = await usersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        incomeId: 'non-exiting-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})

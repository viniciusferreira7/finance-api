import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryIncomesRepository } from '@/repositories/in-memory/in-memory-incomes.repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { DeleteUserIncome } from './delete-user-income'
import { ResourceNotFound } from './error/resource-not-found-error'

let incomesRepository: InMemoryIncomesRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteUserIncome

describe('Delete user income use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    incomesRepository = new InMemoryIncomesRepository()
    sut = new DeleteUserIncome(incomesRepository, usersRepository)
  })

  it('should be able to delete an existing income', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const income = await incomesRepository.create({
      value: 1000,
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
      value: 1000,
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

import dayjs from 'dayjs'

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetCategoriesWithTheMostRecordRequestUseCase {
  userId: string
  endDate?: string
}

type GetCategoriesWithTheMostRecordResponseUseCase = Array<{
  name: string
  incomes_quantity: number
  expenses_quantity: number
}>

export class GetCategoriesWithTheMostRecordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
    endDate,
  }: GetCategoriesWithTheMostRecordRequestUseCase): Promise<GetCategoriesWithTheMostRecordResponseUseCase> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const formattedEndDate = dayjs(endDate).isValid()
      ? dayjs(endDate).format('YYYY-MM')
      : dayjs().format('YYYY-MM')

    const metrics = this.metricsRepository.findCategoriesWithTheMostRecord({
      userId,
      endDate: formattedEndDate,
    })

    return metrics
  }
}

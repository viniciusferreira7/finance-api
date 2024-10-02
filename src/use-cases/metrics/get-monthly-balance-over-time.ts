import dayjs from 'dayjs'

import type { MetricsRepository } from '@/repositories/metrics-repository'
import type { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFound } from '../error/resource-not-found-error'

interface GetMonthlyBalanceOverTimeUseCaseRequest {
  userId: string
  endDate?: string
}

type GetMonthlyBalanceOverTimeUseCaseResponse = Array<{
  date: string
  balance: number
}>

export class GetMonthlyBalanceOverTimeUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private metricsRepository: MetricsRepository,
  ) {}

  async execute({
    userId,
    endDate,
  }: GetMonthlyBalanceOverTimeUseCaseRequest): Promise<GetMonthlyBalanceOverTimeUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    const formattedEndDate = dayjs(endDate).isValid()
      ? dayjs(endDate).format('YYYY-MM')
      : dayjs().format('YYYY-MM')

    const metrics = await this.metricsRepository.getMonthlyBalanceOverTime({
      userId,
      endDate: formattedEndDate,
    })

    return metrics.slice(0, 12)
  }
}

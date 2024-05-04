import { IncomeRepository } from '@/repositories/incomes.repository'

interface CreateIncomeRequest {
  value: number
  description: string
  category_id: string
}

export class CreateIncomeUseCase {
  constructor(private incomesRepository: IncomeRepository) {}

  async execute({ value, description, category_id }: CreateIncomeRequest) {}
}

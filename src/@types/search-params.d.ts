import { PaginationRequest } from './pagination.js'

export interface SearchParams extends PaginationRequest {
  categoryId: string
  name: string
  value: number
  sort: 'asc' | 'desc'
  createdAt: {
    from: string
    to?: string
  }
  updatedAt: {
    from: string
    to?: string
  }
}

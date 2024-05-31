export interface PaginationRequest {
  page: number
  per_page: number
}

export interface PaginationResponse<T> {
  count: number
  next: number | null
  previous: number | null
  page: number
  total_pages: number
  per_page: number
  results: T[]
}

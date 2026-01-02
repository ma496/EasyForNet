import { SortDirection } from '@/store/api/base/sort-direction'

export interface ListRequestDto<TId> {
  page?: number
  pageSize?: number
  sortField?: string
  sortDirection?: SortDirection
  search?: string
  all?: boolean
  includeIds?: TId[]
}

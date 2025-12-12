import { SortDirection } from '@/store/api/base/sort-direction'

export type ListRequestDto<TId> = {
  page?: number
  pageSize?: number
  sortField?: string
  sortDirection?: SortDirection
  search?: string
  all?: boolean
  includeIds?: TId[]
}

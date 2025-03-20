import { SortDirection } from "@/store/api/base/sort-direction";

export type ListRequestDto = {
  page: number
  pageSize: number
  sortField?: string
  sortDirection?: SortDirection
  search?: string
  all?: boolean
}


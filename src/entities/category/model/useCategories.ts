import { useQuery } from '@tanstack/react-query'

import { getCategories } from '../api/categoryRepository'
import { categoryQueryKeys } from './category.queryKeys'

export function useCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: getCategories,
  })
}

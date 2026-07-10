import { useQuery } from '@tanstack/react-query'

import { getCategoryBySlug } from '../api/categoryRepository'
import { categoryQueryKeys } from './category.queryKeys'

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryQueryKeys.detail(slug),
    queryFn: () => getCategoryBySlug(slug),
  })
}

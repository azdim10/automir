import { useQuery } from '@tanstack/react-query'

import { getFeaturedProducts } from '../api/productRepository'
import { productQueryKeys } from './product.queryKeys'

export function useFeaturedProducts(limit: number) {
  return useQuery({
    queryKey: productQueryKeys.featured(limit),
    queryFn: () => getFeaturedProducts(limit),
  })
}

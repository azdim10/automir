import { useQuery } from '@tanstack/react-query'

import { getProductsByIds } from '../api/productRepository'
import { productQueryKeys } from './product.queryKeys'

export function useHomeFeaturedProducts(productIds: string[]) {
  return useQuery({
    queryKey: productQueryKeys.byIds(productIds),
    queryFn: () => getProductsByIds(productIds),
    enabled: productIds.length > 0,
  })
}

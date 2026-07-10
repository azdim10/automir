import { useQuery } from '@tanstack/react-query'

import { getProducts } from '../api/productRepository'
import { productQueryKeys } from './product.queryKeys'
import type { ProductListParams } from './product.types'

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => getProducts(params),
  })
}

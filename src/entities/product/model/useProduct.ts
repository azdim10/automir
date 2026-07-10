import { useQuery } from '@tanstack/react-query'

import { getProductById } from '../api/productRepository'
import { productQueryKeys } from './product.queryKeys'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productQueryKeys.detail(id ?? ''),
    queryFn: () => getProductById(id ?? ''),
    enabled: Boolean(id),
  })
}

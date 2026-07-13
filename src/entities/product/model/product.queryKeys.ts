import type { ProductListParams } from './product.types'

export const productQueryKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) =>
    [...productQueryKeys.all, 'list', params] as const,
  detail: (slug: string) => [...productQueryKeys.all, 'detail', slug] as const,
  byIds: (ids: string[]) =>
    [...productQueryKeys.all, 'by-ids', ids] as const,
  featured: (limit: number) =>
    [...productQueryKeys.all, 'featured', limit] as const,
}

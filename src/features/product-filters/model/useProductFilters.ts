import { create } from 'zustand'

import type { ProductSort } from '@entities/product'

interface ProductFiltersState {
  categorySlug: string | null
  sort: ProductSort
  setCategorySlug: (categorySlug: string | null) => void
  setSort: (sort: ProductSort) => void
  reset: () => void
}

const DEFAULT_SORT: ProductSort = 'created-desc'

export const useProductFilters = create<ProductFiltersState>((set) => ({
  categorySlug: null,
  sort: DEFAULT_SORT,
  setCategorySlug: (categorySlug) => {
    set({ categorySlug })
  },
  setSort: (sort) => {
    set({ sort })
  },
  reset: () => {
    set({ categorySlug: null, sort: DEFAULT_SORT })
  },
}))

import { create } from 'zustand'

interface ProductSearchState {
  search: string
  setSearch: (search: string) => void
  reset: () => void
}

export const useProductSearch = create<ProductSearchState>((set) => ({
  search: '',
  setSearch: (search) => {
    set({ search })
  },
  reset: () => {
    set({ search: '' })
  },
}))

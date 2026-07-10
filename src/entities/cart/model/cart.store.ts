import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartState } from './cart.types'

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const quantity = item.quantity ?? 1
          const existingItem = state.items.find(
            (cartItem) => cartItem.productId === item.productId,
          )

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantity,
                    }
                  : cartItem,
              ),
            }
          }

          return {
            items: [...state.items, { ...item, quantity }],
          }
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                )
              : state.items.filter((item) => item.productId !== productId),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'automir-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

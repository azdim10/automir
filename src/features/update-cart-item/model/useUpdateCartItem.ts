import { useCartStore } from '@entities/cart'

export function useUpdateCartItem() {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return {
    updateQuantity,
    removeItem,
  }
}

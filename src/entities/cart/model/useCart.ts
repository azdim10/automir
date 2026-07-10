import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from './cart.selectors'
import { useCartStore } from './cart.store'

export function useCart() {
  const items = useCartStore(selectCartItems)
  const itemsCount = useCartStore(selectCartItemsCount)
  const total = useCartStore(selectCartTotal)
  const addItem = useCartStore((state) => state.addItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)

  return {
    items,
    itemsCount,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  }
}

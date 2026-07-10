import type { CartItem, CartState } from './cart.types'

export const selectCartItems = (state: CartState): CartItem[] => state.items

export const selectCartItemsCount = (state: CartState): number =>
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)

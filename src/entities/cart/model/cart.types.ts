export interface CartItem {
  productId: string
  slug: string
  name: string
  sku: string
  price: number
  currency: string
  quantity: number
  imageUrl: string | null
  imageAlt: string | null
}

export type AddCartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number
}

export interface CartState {
  items: CartItem[]
  addItem: (item: AddCartItemInput) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

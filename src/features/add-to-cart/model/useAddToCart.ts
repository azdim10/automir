import { useCartStore } from '@entities/cart'
import type { Product } from '@entities/product'

export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem)

  return (product: Product, quantity = 1) => {
    const image = product.images[0]

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      price: product.price,
      imageUrl: image?.url ?? null,
      imageAlt: image?.alt ?? null,
      quantity,
    })
  }
}

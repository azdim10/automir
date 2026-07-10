import type { Product } from '@entities/product'
import { Button } from '@shared/ui'

import { useAddToCart } from '../model/useAddToCart'

interface AddToCartButtonProps {
  product: Product
  label: string
  quantity?: number
}

export function AddToCartButton({
  product,
  label,
  quantity,
}: AddToCartButtonProps) {
  const addToCart = useAddToCart()

  return (
    <Button
      onClick={() => {
        addToCart(product, quantity)
      }}
    >
      {label}
    </Button>
  )
}

import type { Product } from '@entities/product'
import { Button } from '@shared/ui'

import { useAddToCart } from '../model/useAddToCart'

interface AddToCartButtonProps {
  product: Product
  label: string
  quantity?: number
  successLabel?: string
}

export function AddToCartButton({
  label,
  product,
  quantity,
  successLabel,
}: AddToCartButtonProps) {
  const addToCart = useAddToCart()

  return (
    <Button
      onClick={() => {
        addToCart(product, quantity, successLabel)
      }}
    >
      {label}
    </Button>
  )
}

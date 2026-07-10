import { Button } from '@shared/ui'

import { useUpdateCartItem } from '../model/useUpdateCartItem'

interface CartQuantityControlProps {
  productId: string
  quantity: number
  decrementLabel: string
  incrementLabel: string
  removeLabel: string
}

export function CartQuantityControl({
  productId,
  quantity,
  decrementLabel,
  incrementLabel,
  removeLabel,
}: CartQuantityControlProps) {
  const { updateQuantity, removeItem } = useUpdateCartItem()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-label={decrementLabel}
        size="sm"
        variant="outline"
        onClick={() => {
          updateQuantity(productId, quantity - 1)
        }}
      >
        {decrementLabel}
      </Button>
      <span className="min-w-8 text-center text-sm font-medium">
        {quantity}
      </span>
      <Button
        aria-label={incrementLabel}
        size="sm"
        variant="outline"
        onClick={() => {
          updateQuantity(productId, quantity + 1)
        }}
      >
        {incrementLabel}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          removeItem(productId)
        }}
      >
        {removeLabel}
      </Button>
    </div>
  )
}

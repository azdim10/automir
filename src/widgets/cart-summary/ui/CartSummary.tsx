import { useCart } from '@entities/cart'
import { formatCurrency } from '@shared/lib/format'

interface CartSummaryLabels {
  items: string
  total: string
}

interface CartSummaryProps {
  labels: CartSummaryLabels
  currency: string
  locale: string
}

export function CartSummary({ labels, currency, locale }: CartSummaryProps) {
  const { items, itemsCount, total } = useCart()

  return (
    <aside className="rounded-lg border border-slate-200 p-4">
      <div className="flex justify-between gap-4">
        <span>{labels.items}</span>
        <span>{itemsCount}</span>
      </div>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li className="flex justify-between gap-4" key={item.productId}>
            <span>{item.name}</span>
            <span>{item.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between gap-4 font-semibold">
        <span>{labels.total}</span>
        <span>{formatCurrency(total, currency, locale)}</span>
      </div>
    </aside>
  )
}

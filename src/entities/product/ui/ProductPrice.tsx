import { formatCurrency } from '@shared/lib/format'

interface ProductPriceProps {
  price: number
  oldPrice: number | null
  locale: string
}

export function ProductPrice({ price, oldPrice, locale }: ProductPriceProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-semibold">{formatCurrency(price, locale)}</span>
      {oldPrice ? (
        <span className="text-sm text-slate-500 line-through">
          {formatCurrency(oldPrice, locale)}
        </span>
      ) : null}
    </div>
  )
}

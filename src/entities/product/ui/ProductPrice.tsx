import { formatCurrency } from '@shared/lib/format'

interface ProductPriceProps {
  price: number
  oldPrice: number | null
  currency: string
  locale: string
}

export function ProductPrice({
  price,
  oldPrice,
  currency,
  locale,
}: ProductPriceProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-semibold">
        {formatCurrency(price, currency, locale)}
      </span>
      {oldPrice ? (
        <span className="text-sm text-slate-500 line-through">
          {formatCurrency(oldPrice, currency, locale)}
        </span>
      ) : null}
    </div>
  )
}

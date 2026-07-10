import type { ReactNode } from 'react'
import { Link } from 'react-router'

import type { Product } from '../model/product.types'
import { ProductPrice } from './ProductPrice'

interface ProductCardProps {
  product: Product
  href: string
  locale: string
  action?: ReactNode
}

export function ProductCard({
  product,
  href,
  locale,
  action,
}: ProductCardProps) {
  const mainImage = product.images[0]

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {mainImage ? (
        <Link to={href}>
          <img
            className="aspect-square w-full object-cover"
            src={mainImage.url}
            alt={mainImage.alt}
          />
        </Link>
      ) : null}
      <div className="space-y-3 p-4">
        <Link className="block font-medium" to={href}>
          {product.name}
        </Link>
        <ProductPrice
          price={product.price}
          oldPrice={product.oldPrice}
          currency={product.currency}
          locale={locale}
        />
        {action}
      </div>
    </article>
  )
}

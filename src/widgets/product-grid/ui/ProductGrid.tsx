import type { ReactNode } from 'react'

import { ProductCard, type Product } from '@entities/product'

interface ProductGridProps {
  products: Product[]
  locale: string
  getProductHref: (product: Product) => string
  renderProductAction?: (product: Product) => ReactNode
}

export function ProductGrid({
  products,
  locale,
  getProductHref,
  renderProductAction,
}: ProductGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          href={getProductHref(product)}
          locale={locale}
          action={renderProductAction?.(product)}
        />
      ))}
    </div>
  )
}

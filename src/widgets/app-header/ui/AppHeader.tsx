import type { ReactNode } from 'react'

import { useCart } from '@entities/cart'
import { useCategories } from '@entities/category'

interface AppHeaderProps {
  logo: ReactNode
  homeHref: string
  cartHref: string
  cartLabel: string
  getCategoryHref: (slug: string) => string
}

export function AppHeader({
  logo,
  homeHref,
  cartHref,
  cartLabel,
  getCategoryHref,
}: AppHeaderProps) {
  const { data: categories = [] } = useCategories()
  const { itemsCount } = useCart()

  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <a href={homeHref}>{logo}</a>
        <nav>
          <ul className="flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <li key={category.id}>
                <a href={getCategoryHref(category.slug)}>{category.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="flex items-center gap-2" href={cartHref}>
          <span>{cartLabel}</span>
          <span>{itemsCount}</span>
        </a>
      </div>
    </header>
  )
}

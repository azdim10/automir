import { Link } from 'react-router'

import { useCart } from '@entities/cart'
import { useCategories } from '@entities/category'
import { cn } from '@shared/lib/styles/cn'
import { Container, Skeleton, Typography } from '@shared/ui'
import { CartIcon } from '@shared/ui/icon/CartIcon'

interface AppHeaderProps {
  cartAriaLabel: string
  catalogLabel: string
  logoAlt: string | null
  logoUrl: string | null
  phone: string | null
  storeName: string
}

export function AppHeader({
  cartAriaLabel,
  catalogLabel,
  logoAlt,
  logoUrl,
  phone,
  storeName,
}: AppHeaderProps) {
  const { data: categories = [] } = useCategories()
  const { itemsCount } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link className="flex min-w-0 items-center gap-3" to="/">
          {logoUrl ? (
            <img
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
              src={logoUrl}
              alt={logoAlt ?? storeName}
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
              {storeName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <Typography
              as="span"
              className="block truncate"
              variant="body"
              weight="semibold"
            >
              {storeName}
            </Typography>
            {phone ? (
              <Typography
                as="span"
                className="block truncate text-slate-500"
                variant="caption"
              >
                {phone}
              </Typography>
            ) : null}
          </div>
        </Link>

        <nav className="hidden flex-1 justify-center md:flex">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                to="/catalog"
              >
                {catalogLabel}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  to={`/catalog/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          aria-label={cartAriaLabel}
          className={cn(
            'relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50',
          )}
          title={cartAriaLabel}
          to="/cart"
        >
          <CartIcon className="h-5 w-5" />
          {itemsCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[11px] font-semibold text-white">
              {itemsCount > 99 ? '99+' : itemsCount}
            </span>
          ) : null}
        </Link>
      </Container>
    </header>
  )
}

export function AppHeaderSkeleton() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-11 w-11 rounded-full" />
      </Container>
    </header>
  )
}

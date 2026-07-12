import { Link, NavLink } from 'react-router'

import { useCart } from '@entities/cart'
import { RequestCallbackButton, type CallbackLabels } from '@features/request-callback'
import { cn } from '@shared/lib/styles/cn'
import { Container, Skeleton, Typography } from '@shared/ui'
import { CartIcon } from '@shared/ui/icon/CartIcon'

import {
  getHeaderNavItems,
  type HeaderLabels,
} from '../model/headerNav'

interface AppHeaderProps {
  callbackLabels: CallbackLabels
  cartAriaLabel: string
  headerLabels: HeaderLabels
  logoAlt: string | null
  logoUrl: string | null
  phone: string | null
  storeName: string
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  )

const iconButtonClassName =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50'

export function AppHeader({
  callbackLabels,
  cartAriaLabel,
  headerLabels,
  logoAlt,
  logoUrl,
  phone,
  storeName,
}: AppHeaderProps) {
  const { itemsCount } = useCart()
  const navItems = getHeaderNavItems(headerLabels)

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
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink className={navLinkClassName} end={item.to === '/'} to={item.to}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <RequestCallbackButton labels={callbackLabels} />

          <Link
            aria-label={cartAriaLabel}
            className={cn(iconButtonClassName, 'relative')}
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
        </div>
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
        <div className="flex gap-2">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </Container>
    </header>
  )
}

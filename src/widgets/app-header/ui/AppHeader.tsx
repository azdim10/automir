import { Link, NavLink } from 'react-router'

import { useCart } from '@entities/cart'
import { RequestCallbackButton, type CallbackLabels } from '@features/request-callback'
import { cn } from '@shared/lib/styles/cn'
import { Container, Skeleton } from '@shared/ui'
import { CartIcon } from '@shared/ui/icon/CartIcon'

import {
  getHeaderNavItems,
  type HeaderLabels,
} from '../model/headerNav'
import { HeaderLogo } from './HeaderLogo'

interface AppHeaderProps {
  callbackLabels: CallbackLabels
  cartAriaLabel: string
  headerLabels: HeaderLabels
  logoAlt: string | null
  logoUrl: string | null
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-2 py-2 text-xs font-medium transition-colors lg:px-3 lg:text-sm',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  )

const iconButtonClassName =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50'

function normalizeLogoUrl(logoUrl: string | null): string | null {
  if (!logoUrl) {
    return null
  }

  const trimmed = logoUrl.trim()

  return trimmed.length > 0 ? trimmed : null
}

export function AppHeader({
  callbackLabels,
  cartAriaLabel,
  headerLabels,
  logoAlt,
  logoUrl,
}: AppHeaderProps) {
  const { itemsCount } = useCart()
  const navItems = getHeaderNavItems(headerLabels)
  const resolvedLogoUrl = normalizeLogoUrl(logoUrl)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link
          aria-label={headerLabels.home}
          className="inline-flex max-w-[12rem] shrink-0 sm:max-w-[18rem] lg:max-w-[24rem]"
          to="/"
        >
          {resolvedLogoUrl ? (
            <HeaderLogo
              key={resolvedLogoUrl}
              alt={logoAlt ?? headerLabels.home}
              className="h-12 w-auto max-w-full object-contain sm:h-14"
              fallbackClassName="block h-12 w-full min-w-[10rem] rounded bg-slate-100 sm:h-14"
              url={resolvedLogoUrl}
            />
          ) : (
            <span className="block h-12 w-full min-w-[10rem] rounded bg-slate-100 sm:h-14" />
          )}
        </Link>

        <nav className="hidden flex-1 justify-center overflow-x-auto md:flex">
          <ul className="flex min-w-max items-center gap-1 px-1 lg:gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={navLinkClassName}
                  end={item.to === '/'}
                  to={item.to}
                >
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
      <Container className="flex items-center justify-between gap-4 py-3">
        <Skeleton className="h-10 w-40 sm:h-12 sm:w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </Container>
    </header>
  )
}

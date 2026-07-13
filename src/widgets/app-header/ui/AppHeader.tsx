import { useEffect, useId, useState } from 'react'
import { Link, useLocation } from 'react-router'

import { useCart } from '@entities/cart'
import { RequestCallbackButton, type CallbackLabels } from '@features/request-callback'
import { cn } from '@shared/lib/styles/cn'
import { Container, Skeleton } from '@shared/ui'
import { CartIcon } from '@shared/ui/icon/CartIcon'
import { CloseIcon } from '@shared/ui/icon/CloseIcon'
import { MenuIcon } from '@shared/ui/icon/MenuIcon'

import {
  getHeaderNavItems,
  type HeaderLabels,
} from '../model/headerNav'
import { HeaderLogo } from './HeaderLogo'
import { HeaderNavLinks } from './HeaderNavLinks'
import { HeaderSearch } from './HeaderSearch'

interface AppHeaderProps {
  callbackLabels: CallbackLabels
  cartAriaLabel: string
  headerLabels: HeaderLabels
  logoAlt: string | null
  logoUrl: string | null
}

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
  const location = useLocation()
  const mobileMenuId = useId()
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null)
  const isMobileMenuOpen = mobileMenuPath === location.pathname
  const navItems = getHeaderNavItems(headerLabels)
  const resolvedLogoUrl = normalizeLogoUrl(logoUrl)

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuPath(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex min-w-0 items-center gap-3 py-3 lg:gap-4">
        <Link
          aria-label={headerLabels.home}
          className="inline-flex min-w-0 max-w-[9rem] shrink-0 sm:max-w-[11rem] lg:max-w-[14rem]"
          to="/"
        >
          {resolvedLogoUrl ? (
            <HeaderLogo
              key={resolvedLogoUrl}
              alt={logoAlt ?? headerLabels.home}
              className="h-11 w-auto max-w-full object-contain sm:h-12"
              fallbackClassName="block h-11 w-full rounded bg-slate-100 sm:h-12"
              url={resolvedLogoUrl}
            />
          ) : (
            <span className="block h-11 w-full rounded bg-slate-100 sm:h-12" />
          )}
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hidden min-w-0 flex-1 justify-center lg:flex"
        >
          <HeaderNavLinks items={navItems} variant="desktop" />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <HeaderSearch
            ariaLabel={headerLabels.search}
            placeholder={headerLabels.searchPlaceholder}
          />

          <button
            aria-controls={mobileMenuId}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            className={cn(iconButtonClassName, 'lg:hidden')}
            type="button"
            onClick={() => {
              setMobileMenuPath((current) =>
                current === location.pathname ? null : location.pathname,
              )
            }}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>

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

      <div
        className={cn(
          'grid overflow-hidden border-t border-slate-200 bg-white transition-[grid-template-rows] duration-300 ease-out lg:hidden',
          isMobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Мобильная навигация" id={mobileMenuId}>
            <HeaderNavLinks
              items={navItems}
              variant="mobile"
              onNavigate={() => {
                setMobileMenuPath(null)
              }}
            />
          </nav>
        </div>
      </div>
    </header>
  )
}

export function AppHeaderSkeleton() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Skeleton className="h-10 w-32 sm:h-11 sm:w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-11 rounded-full lg:hidden" />
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
      </Container>
    </header>
  )
}

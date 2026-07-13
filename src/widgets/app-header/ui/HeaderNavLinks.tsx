import { NavLink } from 'react-router'

import { cn } from '@shared/lib/styles/cn'

import type { HeaderNavItem } from '../model/headerNav'

interface HeaderNavLinksProps {
  items: HeaderNavItem[]
  onNavigate?: () => void
  variant: 'desktop' | 'mobile'
}

const desktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'whitespace-nowrap rounded-md px-2.5 py-2 text-xs font-medium transition-colors xl:px-3 xl:text-sm',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  )

const mobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-12 items-center rounded-lg px-4 text-base font-medium transition-colors',
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-800 hover:bg-slate-100',
  )

export function HeaderNavLinks({
  items,
  onNavigate,
  variant,
}: HeaderNavLinksProps) {
  if (variant === 'mobile') {
    return (
      <ul className="grid gap-1 p-3">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              className={mobileLinkClassName}
              end={item.to === '/'}
              to={item.to}
              onClick={onNavigate}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-1">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            className={desktopLinkClassName}
            end={item.to === '/'}
            to={item.to}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

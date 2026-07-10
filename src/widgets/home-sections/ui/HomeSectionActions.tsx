import { cn } from '@shared/lib/styles/cn'

import type { HomeSectionAction } from '../model/homeSection.types'

interface HomeSectionActionsProps {
  actions: HomeSectionAction[] | undefined
}

const actionClassName: Record<Required<HomeSectionAction>['variant'], string> =
  {
    primary: 'bg-slate-900 text-white hover:bg-slate-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline:
      'border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50',
  }

export function HomeSectionActions({ actions }: HomeSectionActionsProps) {
  if (!actions || actions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <a
          className={cn(
            'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors',
            actionClassName[action.variant ?? 'primary'],
          )}
          href={action.href}
          key={`${action.href}-${action.label}`}
        >
          {action.label}
        </a>
      ))}
    </div>
  )
}

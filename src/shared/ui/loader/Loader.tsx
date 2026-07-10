import type { HTMLAttributes } from 'react'

import { cn } from '@shared/lib/styles/cn'

type LoaderSize = 'sm' | 'md' | 'lg'
type LoaderVariant = 'spinner' | 'dots'

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize
  variant?: LoaderVariant
  label?: string
}

const spinnerSizeClassName: Record<LoaderSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-4',
}

const dotSizeClassName: Record<LoaderSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-3',
}

export function Loader({
  className,
  label,
  size = 'md',
  variant = 'spinner',
  ...props
}: LoaderProps) {
  if (variant === 'dots') {
    return (
      <div
        aria-label={label}
        className={cn('inline-flex items-center gap-1', className)}
        role="status"
        {...props}
      >
        {[0, 1, 2].map((item) => (
          <span
            className={cn(
              'animate-pulse rounded-full bg-current',
              dotSizeClassName[size],
            )}
            key={item}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-r-transparent',
        spinnerSizeClassName[size],
        className,
      )}
      role="status"
      {...props}
    />
  )
}

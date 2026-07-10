import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@shared/lib/styles/cn'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

interface ContainerProps extends PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
> {
  size?: ContainerSize
  padding?: ContainerPadding
}

const sizeClassName: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-none',
}

const paddingClassName: Record<ContainerPadding, string> = {
  none: '',
  sm: 'px-3',
  md: 'px-4 sm:px-6',
  lg: 'px-6 sm:px-8',
}

export function Container({
  children,
  className,
  padding = 'md',
  size = 'lg',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeClassName[size],
        paddingClassName[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

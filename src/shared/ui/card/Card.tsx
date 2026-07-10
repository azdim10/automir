import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@shared/lib/styles/cn'

type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  variant?: CardVariant
  padding?: CardPadding
}

type CardSectionProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

const variantClassName: Record<CardVariant, string> = {
  default: 'border border-slate-200 bg-white',
  outlined: 'border border-slate-300 bg-transparent',
  elevated: 'border border-slate-100 bg-white shadow-sm',
  ghost: 'bg-transparent',
}

const paddingClassName: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  children,
  className,
  padding = 'md',
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        variantClassName[variant],
        paddingClassName[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: CardSectionProps) {
  return (
    <div className={cn('mb-4 grid gap-1', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: CardSectionProps) {
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: CardSectionProps) {
  return (
    <div className={cn('mt-4 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
}

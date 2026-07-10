import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@shared/lib/styles/cn'

type TypographyVariant =
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'body-sm' | 'caption' | 'muted'

type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold'
type TypographyAlign = 'left' | 'center' | 'right'

type TypographyProps<TTag extends ElementType> = {
  as?: TTag
  align?: TypographyAlign
  children: ReactNode
  className?: string
  variant?: TypographyVariant
  weight?: TypographyWeight
} & Omit<ComponentPropsWithoutRef<TTag>, 'as' | 'children' | 'className'>

const variantClassName: Record<TypographyVariant, string> = {
  display: 'text-4xl leading-tight tracking-tight md:text-5xl',
  h1: 'text-3xl leading-tight tracking-tight md:text-4xl',
  h2: 'text-2xl leading-tight tracking-tight md:text-3xl',
  h3: 'text-xl leading-snug md:text-2xl',
  body: 'text-base leading-7',
  'body-sm': 'text-sm leading-6',
  caption: 'text-xs leading-5',
  muted: 'text-sm leading-6 text-slate-500',
}

const weightClassName: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const alignClassName: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Typography<TTag extends ElementType = 'p'>({
  align = 'left',
  as,
  children,
  className,
  variant = 'body',
  weight = 'regular',
  ...props
}: TypographyProps<TTag>) {
  const Component = as ?? 'p'

  return (
    <Component
      className={cn(
        variantClassName[variant],
        weightClassName[weight],
        alignClassName[align],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

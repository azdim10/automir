import type { InputHTMLAttributes } from 'react'

import { cn } from '@shared/lib/styles/cn'

type InputSize = 'sm' | 'md' | 'lg'
type InputState = 'default' | 'error' | 'success'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize
  state?: InputState
  fullWidth?: boolean
}

const sizeClassName: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const stateClassName: Record<InputState, string> = {
  default: 'border-slate-300 focus:border-slate-900',
  error: 'border-red-500 focus:border-red-600',
  success: 'border-emerald-500 focus:border-emerald-600',
}

export function Input({
  className,
  fullWidth = true,
  inputSize = 'md',
  state = 'default',
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        'rounded-md border bg-white outline-none transition-colors placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
        sizeClassName[inputSize],
        stateClassName[state],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}

import { useEffect, useState } from 'react'

import { cn } from '@shared/lib/styles/cn'

import { useToastStore, type ToastItem } from './toast.store'

interface ToastCardProps {
  onDismiss: (id: string) => void
  toast: ToastItem
}

const typeClassName: Record<ToastItem['type'], string> = {
  success: 'border-emerald-200 bg-white',
  error: 'border-red-200 bg-white',
  info: 'border-slate-200 bg-white',
}

const indicatorClassName: Record<ToastItem['type'], string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-slate-500',
}

function ToastCard({ onDismiss, toast }: ToastCardProps) {
  const [phase, setPhase] = useState<'entering' | 'leaving' | 'visible'>(
    'entering',
  )

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => {
      setPhase('visible')
    })
    const leaveTimer = window.setTimeout(() => {
      setPhase('leaving')
    }, 2800)
    const removeTimer = window.setTimeout(() => {
      onDismiss(toast.id)
    }, 3200)

    return () => {
      cancelAnimationFrame(enterFrame)
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [onDismiss, toast.id])

  return (
    <div
      className={cn(
        'pointer-events-auto grid w-full max-w-sm grid-cols-[auto_1fr] gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 ease-out motion-reduce:transition-none',
        typeClassName[toast.type],
        phase === 'entering' && 'translate-y-2 opacity-0',
        phase === 'visible' && 'translate-y-0 opacity-100',
        phase === 'leaving' && 'translate-y-2 opacity-0',
      )}
      role="status"
    >
      <span
        aria-hidden
        className={cn('mt-1 h-2 w-2 rounded-full', indicatorClassName[toast.type])}
      />
      <div className="grid gap-0.5">
        {toast.title ? (
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        ) : null}
        <p className="text-sm text-slate-600">{toast.message}</p>
      </div>
    </div>
  )
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] grid w-[calc(100%-2rem)] max-w-sm gap-2 sm:right-6 sm:bottom-6">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

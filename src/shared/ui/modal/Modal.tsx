import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect, useId, useReducer } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@shared/lib/styles/cn'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fit'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnOverlayClick?: boolean
  className?: string
  contentClassName?: string
}

const sizeClassName: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
  fit: 'max-w-[calc(100vw-2rem)]',
}

const widthClassName: Record<ModalSize, string> = {
  sm: 'w-full',
  md: 'w-full',
  lg: 'w-full',
  xl: 'w-full',
  full: 'w-full',
  fit: 'w-fit',
}

const MODAL_TRANSITION_MS = 220

interface ModalPresenceState {
  mounted: boolean
  visible: boolean
}

type ModalPresenceAction =
  | { type: 'close-end' }
  | { type: 'close-start' }
  | { type: 'open' }
  | { type: 'show' }

function modalPresenceReducer(
  state: ModalPresenceState,
  action: ModalPresenceAction,
): ModalPresenceState {
  switch (action.type) {
    case 'open':
      return { mounted: true, visible: false }
    case 'show':
      return { ...state, visible: true }
    case 'close-start':
      return { ...state, visible: false }
    case 'close-end':
      return { mounted: false, visible: false }
    default:
      return state
  }
}

export function Modal({
  children,
  className,
  closeOnOverlayClick = true,
  contentClassName,
  description,
  footer,
  isOpen,
  onClose,
  size = 'md',
  title,
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const [presence, dispatch] = useReducer(modalPresenceReducer, {
    mounted: false,
    visible: false,
  })

  if (isOpen && !presence.mounted) {
    dispatch({ type: 'open' })
  }

  if (!isOpen && presence.mounted && presence.visible) {
    dispatch({ type: 'close-start' })
  }

  useEffect(() => {
    if (!isOpen || !presence.mounted || presence.visible) {
      return
    }

    const frame = requestAnimationFrame(() => {
      dispatch({ type: 'show' })
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [isOpen, presence.mounted, presence.visible])

  useEffect(() => {
    if (isOpen || !presence.mounted || presence.visible) {
      return
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'close-end' })
    }, MODAL_TRANSITION_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isOpen, presence.mounted, presence.visible])

  useEffect(() => {
    if (!presence.mounted || !presence.visible) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, presence.mounted, presence.visible])

  if (!presence.mounted) {
    return null
  }

  return createPortal(
    <div
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-50 grid place-items-center p-4 transition-colors duration-200 ease-out motion-reduce:transition-none',
        presence.visible ? 'bg-slate-950/60' : 'bg-slate-950/0',
        className,
      )}
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
    >
      <div
        className={cn(
          'rounded-xl bg-white p-6 shadow-xl transition-all duration-200 ease-out motion-reduce:transition-none',
          widthClassName[size],
          presence.visible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-2 scale-[0.98] opacity-0',
          sizeClassName[size],
          contentClassName,
        )}
      >
        {title || description ? (
          <div className="mb-4 grid gap-2">
            {title ? (
              <div className="text-lg font-semibold" id={titleId}>
                {title}
              </div>
            ) : null}
            {description ? (
              <div className="text-sm text-slate-500" id={descriptionId}>
                {description}
              </div>
            ) : null}
          </div>
        ) : null}
        <div>{children}</div>
        {footer ? (
          <div className="mt-6 flex justify-end gap-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

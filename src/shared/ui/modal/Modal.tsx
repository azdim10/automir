import type { PropsWithChildren, ReactNode } from 'react'
import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@shared/lib/styles/cn'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

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

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4',
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
          'w-full rounded-xl bg-white p-6 shadow-xl',
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

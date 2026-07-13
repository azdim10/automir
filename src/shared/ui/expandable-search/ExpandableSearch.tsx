import {
  useEffect,
  useId,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react'

import { cn } from '@shared/lib/styles/cn'
import { CloseIcon } from '@shared/ui/icon/CloseIcon'
import { SearchIcon } from '@shared/ui/icon/SearchIcon'

import { Input } from '../input/Input'

interface ExpandableSearchProps {
  ariaLabel: string
  compact?: boolean
  defaultOpen?: boolean
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  value: string
}

const toggleButtonClassName =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50'

export function ExpandableSearch({
  ariaLabel,
  compact = false,
  defaultOpen = false,
  onChange,
  onSubmit,
  placeholder,
  value,
}: ExpandableSearchProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(defaultOpen || !compact)

  useEffect(() => {
    if (!compact || !isOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [compact, isOpen])

  useEffect(() => {
    if (!compact) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [compact, isOpen])

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.()
  }

  if (!compact) {
    return (
      <form className="w-full" onSubmit={handleSubmit}>
        <Input
          aria-label={ariaLabel}
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
      </form>
    )
  }

  return (
    <form className="flex items-center justify-end" onSubmit={handleSubmit}>
      <div
        className={cn(
          'grid items-center overflow-hidden transition-[grid-template-columns] duration-300 ease-out',
          isOpen
            ? 'grid-cols-[minmax(0,11rem)_auto] sm:grid-cols-[minmax(0,14rem)_auto]'
            : 'grid-cols-[0fr_auto]',
        )}
      >
        <Input
          ref={inputRef}
          aria-label={ariaLabel}
          className="min-w-0"
          fullWidth
          id={inputId}
          inputSize="sm"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        <button
          aria-controls={inputId}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Скрыть поиск' : ariaLabel}
          className={cn(toggleButtonClassName, isOpen && 'rounded-l-none border-l-0')}
          type="button"
          onClick={() => {
            setIsOpen((current) => !current)
          }}
        >
          {isOpen ? (
            <CloseIcon className="h-4 w-4" />
          ) : (
            <SearchIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  )
}

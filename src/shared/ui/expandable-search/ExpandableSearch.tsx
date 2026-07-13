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
  onSubmit?: (value: string) => void
  placeholder?: string
  value: string
}

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
    onSubmit?.(value)
  }

  function openSearch() {
    setIsOpen(true)
  }

  function closeSearch() {
    setIsOpen(false)
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
    <form className="flex justify-end" onSubmit={handleSubmit}>
      <div
        className={cn(
          'flex h-11 items-center overflow-hidden rounded-full border bg-white transition-[width,border-color,box-shadow] duration-300 ease-out',
          isOpen
            ? 'w-[13rem] border-slate-300 pl-3 shadow-sm sm:w-[16rem]'
            : 'w-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        )}
      >
        <input
          ref={inputRef}
          aria-label={ariaLabel}
          className={cn(
            'min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400',
            isOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none w-0 opacity-0',
          )}
          id={inputId}
          placeholder={placeholder}
          tabIndex={isOpen ? 0 : -1}
          type="search"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        <button
          aria-controls={inputId}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Скрыть поиск' : ariaLabel}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-slate-900 transition-colors hover:text-slate-700"
          type="button"
          onClick={() => {
            if (isOpen) {
              closeSearch()
              return
            }

            openSearch()
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

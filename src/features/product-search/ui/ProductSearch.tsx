import { useEffect, useState } from 'react'

import { useDebouncedValue } from '@shared/lib/hooks'
import { ExpandableSearch } from '@shared/ui/expandable-search/ExpandableSearch'

interface ProductSearchProps {
  ariaLabel: string
  compact?: boolean
  defaultOpen?: boolean
  label?: string
  onSearchChange: (search: string) => void
  onSubmit?: (search: string) => void
  placeholder?: string
  search: string
}

export function ProductSearch({
  ariaLabel,
  compact = false,
  defaultOpen = false,
  label,
  onSearchChange,
  onSubmit,
  placeholder,
  search,
}: ProductSearchProps) {
  const [inputValue, setInputValue] = useState(search)
  const [prevSearch, setPrevSearch] = useState(search)
  const debouncedValue = useDebouncedValue(inputValue)

  if (search !== prevSearch) {
    setPrevSearch(search)
    setInputValue(search)
  }

  useEffect(() => {
    if (debouncedValue !== search) {
      onSearchChange(debouncedValue)
    }
  }, [debouncedValue, onSearchChange, search])

  const field = (
    <ExpandableSearch
      ariaLabel={ariaLabel}
      compact={compact}
      defaultOpen={defaultOpen}
      value={inputValue}
      onChange={setInputValue}
      {...(placeholder ? { placeholder } : {})}
      {...(onSubmit ? { onSubmit: (nextValue) => onSubmit(nextValue) } : {})}
    />
  )

  if (compact || !label) {
    return field
  }

  return (
    <label className="grid w-full gap-2">
      <span className="text-sm font-medium">{label}</span>
      {field}
    </label>
  )
}

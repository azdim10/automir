import { Input } from '@shared/ui'

interface ProductSearchProps {
  label: string
  onSearchChange: (search: string) => void
  placeholder?: string
  search: string
}

export function ProductSearch({
  label,
  onSearchChange,
  placeholder,
  search,
}: ProductSearchProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(event) => {
          onSearchChange(event.target.value)
        }}
      />
    </label>
  )
}

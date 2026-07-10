import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[]
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <select
      className={[
        'w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-slate-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

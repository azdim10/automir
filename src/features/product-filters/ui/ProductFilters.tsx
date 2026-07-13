import type { Category } from '@entities/category'
import type { ProductSort } from '@entities/product'
import { Select } from '@shared/ui'

interface SortOption {
  value: ProductSort
  label: string
}

interface ProductFiltersProps {
  categories: Category[]
  categorySlug: string
  categoryPlaceholder: string
  onCategoryChange: (categorySlug: string) => void
  onSortChange: (sort: ProductSort) => void
  sort: ProductSort
  sortOptions: SortOption[]
}

export function ProductFilters({
  categories,
  categorySlug,
  categoryPlaceholder,
  onCategoryChange,
  onSortChange,
  sort,
  sortOptions,
}: ProductFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:items-end">
      <Select
        value={categorySlug}
        options={[
          { value: '', label: categoryPlaceholder },
          ...categories.map((category) => ({
            value: category.slug,
            label: category.name,
          })),
        ]}
        onChange={(event) => {
          onCategoryChange(event.target.value)
        }}
      />
      <Select
        value={sort}
        options={sortOptions}
        onChange={(event) => {
          onSortChange(event.target.value as ProductSort)
        }}
      />
    </div>
  )
}

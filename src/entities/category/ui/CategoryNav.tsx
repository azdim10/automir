import type { Category } from '../model/category.types'

interface CategoryNavProps {
  categories: Category[]
  getHref: (category: Category) => string
}

export function CategoryNav({ categories, getHref }: CategoryNavProps) {
  return (
    <nav>
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.id}>
            <a
              className="rounded-md border border-slate-200 px-3 py-2 text-sm transition-colors hover:bg-slate-50"
              href={getHref(category)}
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

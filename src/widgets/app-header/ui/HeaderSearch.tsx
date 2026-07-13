import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { ProductSearch } from '@features/product-search'

interface HeaderSearchProps {
  ariaLabel: string
  placeholder: string
}

export function HeaderSearch({ ariaLabel, placeholder }: HeaderSearchProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('search') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setQuery(urlQuery)
  }

  function navigateToCatalog(nextQuery = query) {
    const params = new URLSearchParams()

    if (nextQuery.trim().length > 0) {
      params.set('search', nextQuery.trim())
    }

    const suffix = params.toString()

    void navigate(suffix.length > 0 ? `/catalog?${suffix}` : '/catalog')
  }

  return (
    <ProductSearch
      ariaLabel={ariaLabel}
      compact
      placeholder={placeholder}
      search={query}
      onSearchChange={setQuery}
      onSubmit={() => {
        navigateToCatalog()
      }}
    />
  )
}

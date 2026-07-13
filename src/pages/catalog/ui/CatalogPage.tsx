import { useParams, useSearchParams } from 'react-router'

import { useCategories } from '@entities/category'
import { usePageContent, useSiteSettings } from '@entities/content'
import { type ProductSort, useProducts } from '@entities/product'
import { ProductFilters, ProductSearch } from '@features/index'
import type { Json } from '@shared/api/supabase'
import { getJsonNumber, getJsonString, isJsonRecord } from '@shared/lib/json'
import { cn } from '@shared/lib/styles/cn'
import { Button, Container, EmptyState, Loader, Skeleton, Typography } from '@shared/ui'
import { ProductGrid } from '@widgets/product-grid'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 12
const DEFAULT_SORT: ProductSort = 'created-desc'

interface CatalogLabels {
  categoryPlaceholder: string
  empty: string
  nextPage: string
  page: string
  previousPage: string
  search: string
  searchPlaceholder: string
  total: string
}

interface SortOption {
  value: ProductSort
  label: string
}

function getPageParam(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE
}

function isProductSort(value: string | null): value is ProductSort {
  return (
    value === 'created-desc' ||
    value === 'price-asc' ||
    value === 'price-desc' ||
    value === 'name-asc'
  )
}

function parseCatalogLabels(value: Json | undefined): CatalogLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const categoryPlaceholder = getJsonString(value, 'categoryPlaceholder')
  const empty = getJsonString(value, 'empty')
  const nextPage = getJsonString(value, 'nextPage')
  const page = getJsonString(value, 'page')
  const previousPage = getJsonString(value, 'previousPage')
  const search = getJsonString(value, 'search')
  const searchPlaceholder = getJsonString(value, 'searchPlaceholder')
  const total = getJsonString(value, 'total')

  if (
    !categoryPlaceholder ||
    !empty ||
    !nextPage ||
    !page ||
    !previousPage ||
    !search ||
    !searchPlaceholder ||
    !total
  ) {
    return null
  }

  return {
    categoryPlaceholder,
    empty,
    nextPage,
    page,
    previousPage,
    search,
    searchPlaceholder,
    total,
  }
}

function parseSortOptions(value: Json | undefined): SortOption[] | null {
  if (!Array.isArray(value)) {
    return null
  }

  const options = value.flatMap((item): SortOption[] => {
    if (!isJsonRecord(item)) {
      return []
    }

    const value = getJsonString(item, 'value')
    const label = getJsonString(item, 'label')

    if (!isProductSort(value) || !label) {
      return []
    }

    return [{ value, label }]
  })

  return options.length > 0 ? options : null
}

function CatalogSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton className="h-80" key={index} />
          ))}
        </div>
      </Container>
    </main>
  )
}

export function CatalogPage() {
  const { categorySlug: routeCategorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: pageContent, isLoading: isPageLoading } =
    usePageContent('catalog')
  const { data: siteSettings } = useSiteSettings()
  const { data: categories = [] } = useCategories()
  const queryCategorySlug = searchParams.get('category') ?? ''
  const selectedCategorySlug =
    queryCategorySlug.length > 0 ? queryCategorySlug : (routeCategorySlug ?? '')
  const search = searchParams.get('search') ?? ''
  const sortParam = searchParams.get('sort')
  const sort = isProductSort(sortParam) ? sortParam : DEFAULT_SORT
  const page = getPageParam(searchParams.get('page'))
  const pageSizeSetting = isJsonRecord(siteSettings)
    ? getJsonNumber(siteSettings, 'catalog_page_size')
    : null
  const limit =
    pageSizeSetting && pageSizeSetting > 0 ? pageSizeSetting : DEFAULT_LIMIT
  const {
    data: productList,
    isFetching: isProductsFetching,
    isLoading: isProductsLoading,
  } = useProducts({
    ...(selectedCategorySlug ? { categorySlug: selectedCategorySlug } : {}),
    ...(search ? { search } : {}),
    limit,
    page,
    sort,
  })

  const locale = siteSettings?.locale
  const labels = parseCatalogLabels(siteSettings?.catalog_labels)
  const sortOptions = parseSortOptions(siteSettings?.catalog_sort_options)
  const totalPages = productList
    ? Math.max(1, Math.ceil(productList.total / limit))
    : 1
  const isInitialProductsLoading = isProductsLoading && !productList

  function updateCatalogParams(updates: Record<string, string>) {
    const nextParams = new URLSearchParams(searchParams)

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    }

    setSearchParams(nextParams)
  }

  if (
    isPageLoading ||
    isInitialProductsLoading ||
    !pageContent ||
    !productList ||
    typeof locale !== 'string' ||
    !labels ||
    !sortOptions
  ) {
    return <CatalogSkeleton />
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-2">
              <Typography as="h1" variant="h1" weight="bold">
                {pageContent.page.title}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {labels.total}: {productList.total}
              </Typography>
            </div>
            {isProductsFetching ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader size="sm" />
                <span>Обновление...</span>
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <ProductSearch
              ariaLabel={labels.search}
              label={labels.search}
              placeholder={labels.searchPlaceholder}
              search={search}
              onSearchChange={(value) => {
                updateCatalogParams({ search: value, page: '' })
              }}
            />
            <ProductFilters
              categories={categories}
              categoryPlaceholder={labels.categoryPlaceholder}
              categorySlug={selectedCategorySlug}
              sort={sort}
              sortOptions={sortOptions}
              onCategoryChange={(value) => {
                updateCatalogParams({ category: value, page: '' })
              }}
              onSortChange={(value) => {
                updateCatalogParams({ sort: value, page: '' })
              }}
            />
          </div>
          <div
            className={cn(
              'transition-opacity duration-200',
              isProductsFetching && 'opacity-60',
            )}
          >
            {productList.items.length > 0 ? (
              <ProductGrid
                products={productList.items}
                locale={locale}
                getProductHref={(product) => `/product/${product.id}`}
              />
            ) : (
              <EmptyState title={labels.empty} />
            )}
          </div>
          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                disabled={page <= 1 || isProductsFetching}
                variant="outline"
                onClick={() => {
                  updateCatalogParams({ page: String(page - 1) })
                }}
              >
                {labels.previousPage}
              </Button>
              <Typography variant="body-sm">
                {labels.page} {page} / {totalPages}
              </Typography>
              <Button
                disabled={page >= totalPages || isProductsFetching}
                variant="outline"
                onClick={() => {
                  updateCatalogParams({ page: String(page + 1) })
                }}
              >
                {labels.nextPage}
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </main>
  )
}

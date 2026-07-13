import { Link } from 'react-router'

import { useSiteSettings } from '@entities/content'
import {
  ProductPrice,
  useFeaturedProducts,
  type Product,
} from '@entities/product'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import { Container, Skeleton, Typography } from '@shared/ui'

import type { FeaturedProductsSectionPayload } from '../model/homeSection.types'

interface FeaturedProductsLabels {
  empty: string
}

interface HomeFeaturedProductCardProps {
  detailsLabel: string
  locale: string
  product: Product
}

function parseFeaturedProductsLabels(
  value: Json | undefined,
): FeaturedProductsLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const empty = getJsonString(value, 'empty')

  if (!empty) {
    return null
  }

  return { empty }
}

function HomeFeaturedProductCard({
  detailsLabel,
  locale,
  product,
}: HomeFeaturedProductCardProps) {
  const mainImage = product.images[0]
  const productHref = `/product/${product.id}`

  return (
    <article className="flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link className="block bg-slate-50" to={productHref}>
        {mainImage ? (
          <img
            alt={mainImage.alt}
            className="aspect-square w-full object-contain p-4"
            src={mainImage.url}
          />
        ) : (
          <div className="aspect-square w-full bg-slate-100" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 hover:text-sky-800"
          to={productHref}
        >
          {product.name}
        </Link>
      </div>
      <div className="flex items-center justify-between gap-3 bg-orange-500 px-4 py-3 text-white">
        <div className="[&_span]:text-white">
          <ProductPrice
            locale={locale}
            oldPrice={product.oldPrice}
            price={product.price}
          />
        </div>
        <Link
          className="shrink-0 text-sm font-semibold uppercase tracking-wide hover:underline"
          to={productHref}
        >
          {detailsLabel}
        </Link>
      </div>
    </article>
  )
}

interface FeaturedProductsSectionProps {
  payload: FeaturedProductsSectionPayload
}

export function FeaturedProductsSection({
  payload,
}: FeaturedProductsSectionProps) {
  const { data: siteSettings } = useSiteSettings()
  const { data: products, isLoading } = useFeaturedProducts(payload.limit)
  const labels = parseFeaturedProductsLabels(siteSettings?.home_labels)
  const locale =
    typeof siteSettings?.locale === 'string' ? siteSettings.locale : null

  if (!labels || !locale) {
    return (
      <section className="py-10">
        <Container>
          <Skeleton className="h-64 w-full" />
        </Container>
      </section>
    )
  }

  return (
    <section className="py-10">
      <Container>
        {payload.title ? (
          <Typography
            as="h2"
            className="mb-6 text-sky-900"
            variant="h2"
            weight="bold"
          >
            {payload.title}
          </Typography>
        ) : null}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            <Skeleton className="h-96 w-72 shrink-0" />
            <Skeleton className="h-96 w-72 shrink-0" />
            <Skeleton className="h-96 w-72 shrink-0" />
          </div>
        ) : null}
        {!isLoading && products && products.length > 0 ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {products.map((product) => (
              <HomeFeaturedProductCard
                detailsLabel={payload.detailsLabel}
                key={product.id}
                locale={locale}
                product={product}
              />
            ))}
          </div>
        ) : null}
        {!isLoading && (!products || products.length === 0) ? (
          <Typography className="text-slate-500" variant="body">
            {labels.empty}
          </Typography>
        ) : null}
      </Container>
    </section>
  )
}

import { useParams } from 'react-router'

import { useSiteSettings } from '@entities/content'
import { ProductGallery, ProductPrice, useProduct } from '@entities/product'
import { AddToCartButton } from '@features/add-to-cart'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import { Card, CardContent, Container, Skeleton, Typography } from '@shared/ui'

interface ProductLabels {
  addToCart: string
  attributes: string
  description: string
  sku: string
}

function parseProductLabels(value: Json | undefined): ProductLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const addToCart = getJsonString(value, 'addToCart')
  const attributes = getJsonString(value, 'attributes')
  const description = getJsonString(value, 'description')
  const sku = getJsonString(value, 'sku')

  if (!addToCart || !attributes || !description || !sku) {
    return null
  }

  return {
    addToCart,
    attributes,
    description,
    sku,
  }
}

function ProductDetailsSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="grid content-start gap-5">
            <Skeleton className="h-10 w-full max-w-lg" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Container>
    </main>
  )
}

export function ProductDetailsPage() {
  const { productId } = useParams()
  const { data: siteSettings } = useSiteSettings()
  const { data: product, isError, isLoading } = useProduct(productId)
  const locale = siteSettings?.locale
  const labels = parseProductLabels(siteSettings?.product_labels)

  if (
    isLoading ||
    isError ||
    !productId ||
    !product ||
    typeof locale !== 'string' ||
    !labels
  ) {
    return <ProductDetailsSkeleton />
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} />
          <div className="grid content-start gap-6">
            <div className="grid gap-3">
              <Typography as="h1" variant="h1" weight="bold">
                {product.name}
              </Typography>
              <Typography className="text-slate-500" variant="body-sm">
                {labels.sku}: {product.sku}
              </Typography>
              <ProductPrice
                price={product.price}
                oldPrice={product.oldPrice}
                locale={locale}
              />
            </div>
            <AddToCartButton label={labels.addToCart} product={product} />
            {product.description ? (
              <Card>
                <CardContent>
                  <Typography as="h2" variant="h3" weight="semibold">
                    {labels.description}
                  </Typography>
                  <Typography className="whitespace-pre-line text-slate-600">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            ) : null}
            {product.attributes.length > 0 ? (
              <Card>
                <CardContent>
                  <Typography as="h2" variant="h3" weight="semibold">
                    {labels.attributes}
                  </Typography>
                  <dl className="grid gap-3">
                    {product.attributes.map((attribute) => (
                      <div
                        className="grid gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-2"
                        key={attribute.id}
                      >
                        <dt className="text-sm text-slate-500">
                          {attribute.name}
                        </dt>
                        <dd className="text-sm font-medium text-slate-900">
                          {attribute.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </Container>
    </main>
  )
}

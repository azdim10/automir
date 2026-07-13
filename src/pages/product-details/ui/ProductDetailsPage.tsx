import { useParams } from 'react-router'

import { useSiteSettings } from '@entities/content'
import { ProductGallery, ProductPrice, useProduct } from '@entities/product'
import { AddToCartButton } from '@features/add-to-cart'
import type { Json } from '@shared/api/supabase'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import { Container, Skeleton, Typography } from '@shared/ui'

interface ProductLabels {
  addToCart: string
  addedToCart: string
  applicationArea: string
  attributes: string
  description: string
  generalInfo: string
  modificationApplicability: string
  modificationDesignation: string
  modificationFeatures: string
  modifications: string
  packingNorm: string
  productType: string
  sketch: string
  sku: string
  specificationName: string
  specifications: string
  specificationValue: string
}

function parseProductLabels(value: Json | undefined): ProductLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const keys: (keyof ProductLabels)[] = [
    'addToCart',
    'addedToCart',
    'applicationArea',
    'attributes',
    'description',
    'generalInfo',
    'modificationApplicability',
    'modificationDesignation',
    'modificationFeatures',
    'modifications',
    'packingNorm',
    'productType',
    'sketch',
    'sku',
    'specificationName',
    'specifications',
    'specificationValue',
  ]
  const labels: Partial<ProductLabels> = {}

  for (const key of keys) {
    const label = getJsonString(value, key)

    if (!label) {
      return null
    }

    labels[key] = label
  }

  return labels as ProductLabels
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      as="h2"
      className="text-lg font-bold uppercase tracking-wide text-sky-800"
      variant="h3"
    >
      {children}
    </Typography>
  )
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
          </div>
        </div>
        <div className="mt-10 grid gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
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

  const hasGeneralInfo = Boolean(
    product.productType ??
      product.packingNorm ??
      product.applicationArea ??
      product.description,
  )

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
            <AddToCartButton
              label={labels.addToCart}
              product={product}
              successLabel={labels.addedToCart}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-8">
          {hasGeneralInfo ? (
            <section className="grid gap-4">
              <SectionTitle>{labels.generalInfo}</SectionTitle>
              <div className="grid gap-3 rounded-lg border border-slate-200 p-4">
                {product.productType ? (
                  <Typography className="text-slate-700" variant="body">
                    <span className="font-semibold">{labels.productType}:</span>{' '}
                    {product.productType}
                  </Typography>
                ) : null}
                {product.packingNorm ? (
                  <Typography className="text-slate-700" variant="body">
                    <span className="font-semibold">{labels.packingNorm}:</span>{' '}
                    {product.packingNorm}
                  </Typography>
                ) : null}
                {product.applicationArea ? (
                  <Typography className="text-slate-700" variant="body">
                    <span className="font-semibold">
                      {labels.applicationArea}:
                    </span>{' '}
                    {product.applicationArea}
                  </Typography>
                ) : null}
                {product.description ? (
                  <Typography className="whitespace-pre-line text-slate-600" variant="body">
                    {product.description}
                  </Typography>
                ) : null}
              </div>
            </section>
          ) : null}

          {product.specifications.length > 0 ? (
            <section className="grid gap-4">
              <SectionTitle>{labels.specifications}</SectionTitle>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        {labels.specificationName}
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        {labels.specificationValue}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.map((item) => (
                      <tr
                        className="border-b border-slate-100 last:border-b-0"
                        key={item.id}
                      >
                        <td className="px-4 py-3 text-slate-600">{item.name}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {product.modifications.length > 0 ? (
            <section className="grid gap-4">
              <SectionTitle>{labels.modifications}</SectionTitle>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        {labels.modificationDesignation}
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        {labels.modificationFeatures}
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        {labels.modificationApplicability}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.modifications.map((item) => (
                      <tr
                        className="border-b border-slate-100 last:border-b-0"
                        key={item.id}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {item.designation}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.features}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.applicability}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {product.sketchUrl ? (
            <section className="grid gap-4">
              <SectionTitle>{labels.sketch}</SectionTitle>
              <img
                alt={product.sketchAlt ?? product.name}
                className="max-h-[32rem] w-full rounded-lg border border-slate-200 object-contain"
                src={product.sketchUrl}
              />
            </section>
          ) : null}

          {product.attributes.length > 0 ? (
            <section className="grid gap-4">
              <SectionTitle>{labels.attributes}</SectionTitle>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    {product.attributes.map((attribute) => (
                      <tr
                        className="border-b border-slate-100 last:border-b-0"
                        key={attribute.id}
                      >
                        <td className="w-1/2 px-4 py-3 text-slate-600">
                          {attribute.name}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {attribute.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </Container>
    </main>
  )
}

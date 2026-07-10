import { useNavigate } from 'react-router'

import { useCart } from '@entities/cart'
import { useSiteSettings } from '@entities/content'
import { CartQuantityControl } from '@features/update-cart-item'
import type { Json } from '@shared/api/supabase'
import { formatCurrency } from '@shared/lib/format'
import { getJsonString, isJsonRecord } from '@shared/lib/json'
import {
  Button,
  Card,
  CardContent,
  Container,
  EmptyState,
  Skeleton,
  Typography,
} from '@shared/ui'

interface CartLabels {
  checkout: string
  decrement: string
  empty: string
  increment: string
  items: string
  itemTotal: string
  price: string
  quantity: string
  remove: string
  title: string
  total: string
}

function parseCartLabels(value: Json | undefined): CartLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const checkout = getJsonString(value, 'checkout')
  const decrement = getJsonString(value, 'decrement')
  const empty = getJsonString(value, 'empty')
  const increment = getJsonString(value, 'increment')
  const items = getJsonString(value, 'items')
  const itemTotal = getJsonString(value, 'itemTotal')
  const price = getJsonString(value, 'price')
  const quantity = getJsonString(value, 'quantity')
  const remove = getJsonString(value, 'remove')
  const title = getJsonString(value, 'title')
  const total = getJsonString(value, 'total')

  if (
    !checkout ||
    !decrement ||
    !empty ||
    !increment ||
    !items ||
    !itemTotal ||
    !price ||
    !quantity ||
    !remove ||
    !title ||
    !total
  ) {
    return null
  }

  return {
    checkout,
    decrement,
    empty,
    increment,
    items,
    itemTotal,
    price,
    quantity,
    remove,
    title,
    total,
  }
}

function CartPageSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <Skeleton className="h-48" />
        </div>
      </Container>
    </main>
  )
}

export function CartPage() {
  const navigate = useNavigate()
  const { data: siteSettings } = useSiteSettings()
  const { items, itemsCount, total } = useCart()
  const locale = siteSettings?.locale
  const currency = siteSettings?.currency
  const labels = parseCartLabels(siteSettings?.cart_labels)

  if (typeof locale !== 'string' || typeof currency !== 'string' || !labels) {
    return <CartPageSkeleton />
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8">
          <Typography as="h1" variant="h1" weight="bold">
            {labels.title}
          </Typography>
          {items.length === 0 ? (
            <EmptyState title={labels.empty} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                      {item.imageUrl ? (
                        <img
                          className="aspect-square w-full rounded-lg object-cover"
                          src={item.imageUrl}
                          alt={item.imageAlt ?? item.name}
                        />
                      ) : (
                        <Skeleton className="aspect-square w-full rounded-lg" />
                      )}
                      <div className="grid gap-4">
                        <div className="grid gap-1">
                          <Typography as="h2" variant="h3" weight="semibold">
                            {item.name}
                          </Typography>
                          <Typography
                            className="text-slate-500"
                            variant="body-sm"
                          >
                            {item.sku}
                          </Typography>
                        </div>
                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                          <div>
                            <span>{labels.price}: </span>
                            <span className="font-medium text-slate-900">
                              {formatCurrency(
                                item.price,
                                item.currency,
                                locale,
                              )}
                            </span>
                          </div>
                          <div>
                            <span>{labels.quantity}: </span>
                            <span className="font-medium text-slate-900">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span>{labels.itemTotal}: </span>
                            <span className="font-medium text-slate-900">
                              {formatCurrency(
                                item.price * item.quantity,
                                item.currency,
                                locale,
                              )}
                            </span>
                          </div>
                        </div>
                        <CartQuantityControl
                          decrementLabel={labels.decrement}
                          incrementLabel={labels.increment}
                          productId={item.productId}
                          quantity={item.quantity}
                          removeLabel={labels.remove}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="h-fit">
                <CardContent>
                  <div className="flex justify-between gap-4">
                    <span>{labels.items}</span>
                    <span className="font-medium">{itemsCount}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-lg font-semibold">
                    <span>{labels.total}</span>
                    <span>{formatCurrency(total, currency, locale)}</span>
                  </div>
                  <Button
                    fullWidth
                    onClick={() => {
                      void navigate('/checkout')
                    }}
                  >
                    {labels.checkout}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}

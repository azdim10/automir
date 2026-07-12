import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useCart } from '@entities/cart'
import { useSiteSettings } from '@entities/content'
import type { CreatedOrder } from '@entities/order'
import { CheckoutForm, useCreateOrder } from '@features/checkout-order'
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

interface CheckoutLabels {
  backToCart: string
  deliveryAddress: string
  email: string
  empty: string
  error: string
  name: string
  orderNumber: string
  phone: string
  submit: string
  success: string
  summary: string
  title: string
  total: string
}

function parseCheckoutLabels(value: Json | undefined): CheckoutLabels | null {
  if (!isJsonRecord(value)) {
    return null
  }

  const backToCart = getJsonString(value, 'backToCart')
  const deliveryAddress = getJsonString(value, 'deliveryAddress')
  const email = getJsonString(value, 'email')
  const empty = getJsonString(value, 'empty')
  const error = getJsonString(value, 'error')
  const name = getJsonString(value, 'name')
  const orderNumber = getJsonString(value, 'orderNumber')
  const phone = getJsonString(value, 'phone')
  const submit = getJsonString(value, 'submit')
  const success = getJsonString(value, 'success')
  const summary = getJsonString(value, 'summary')
  const title = getJsonString(value, 'title')
  const total = getJsonString(value, 'total')

  if (
    !backToCart ||
    !deliveryAddress ||
    !email ||
    !empty ||
    !error ||
    !name ||
    !orderNumber ||
    !phone ||
    !submit ||
    !success ||
    !summary ||
    !title ||
    !total
  ) {
    return null
  }

  return {
    backToCart,
    deliveryAddress,
    email,
    empty,
    error,
    name,
    orderNumber,
    phone,
    submit,
    success,
    summary,
    title,
    total,
  }
}

function CheckoutPageSkeleton() {
  return (
    <main className="py-10">
      <Container>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      </Container>
    </main>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null)
  const { items, total, clear } = useCart()
  const { data: siteSettings } = useSiteSettings()
  const createOrderMutation = useCreateOrder()
  const locale = siteSettings?.locale
  const labels = parseCheckoutLabels(siteSettings?.checkout_labels)

  if (typeof locale !== 'string' || !labels) {
    return <CheckoutPageSkeleton />
  }

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8">
          <Typography as="h1" variant="h1" weight="bold">
            {labels.title}
          </Typography>
          {createdOrder ? (
            <Card>
              <CardContent>
                <Typography as="h2" variant="h2" weight="semibold">
                  {labels.success}
                </Typography>
                <Typography className="text-slate-500" variant="body-sm">
                  {labels.orderNumber}: {createdOrder.id}
                </Typography>
                <Button
                  onClick={() => {
                    void navigate('/catalog')
                  }}
                >
                  {labels.backToCart}
                </Button>
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <EmptyState
              title={labels.empty}
              action={
                <Button
                  onClick={() => {
                    void navigate('/catalog')
                  }}
                >
                  {labels.backToCart}
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <Card>
                <CardContent>
                  <CheckoutForm
                    disabled={createOrderMutation.isPending}
                    labels={{
                      name: labels.name,
                      phone: labels.phone,
                      email: labels.email,
                      deliveryAddress: labels.deliveryAddress,
                      submit: labels.submit,
                    }}
                    onSubmit={(customer) => {
                      createOrderMutation.mutate(
                        {
                          customer,
                          items: items.map((item) => ({
                            productId: item.productId,
                            productName: item.name,
                            productSku: item.sku,
                            quantity: item.quantity,
                            unitPrice: item.price,
                          })),
                        },
                        {
                          onSuccess: (order) => {
                            setCreatedOrder(order)
                            clear()
                          },
                        },
                      )
                    }}
                  />
                  {createOrderMutation.isError ? (
                    <Typography className="text-red-600" variant="body-sm">
                      {labels.error}
                    </Typography>
                  ) : null}
                </CardContent>
              </Card>
              <Card className="h-fit">
                <CardContent>
                  <Typography as="h2" variant="h3" weight="semibold">
                    {labels.summary}
                  </Typography>
                  <ul className="grid gap-3">
                    {items.map((item) => (
                      <li
                        className="flex justify-between gap-4 text-sm"
                        key={item.productId}
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            item.price * item.quantity,
                            locale,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between gap-4 text-lg font-semibold">
                    <span>{labels.total}</span>
                    <span>{formatCurrency(total, locale)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}

import { useState } from 'react'

import type { OrderCustomer } from '@entities/order'
import { Button, Input } from '@shared/ui'

interface CheckoutFormLabels {
  name: string
  phone: string
  email: string
  deliveryAddress: string
  submit: string
}

interface CheckoutFormProps {
  labels: CheckoutFormLabels
  onSubmit: (customer: OrderCustomer) => void
  disabled?: boolean
}

export function CheckoutForm({
  labels,
  onSubmit,
  disabled,
}: CheckoutFormProps) {
  const [customer, setCustomer] = useState<OrderCustomer>({
    name: '',
    phone: '',
    email: null,
    deliveryAddress: null,
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(customer)
      }}
    >
      <label className="grid gap-2">
        <span className="text-sm font-medium">{labels.name}</span>
        <Input
          required
          value={customer.name}
          onChange={(event) => {
            setCustomer((current) => ({
              ...current,
              name: event.target.value,
            }))
          }}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">{labels.phone}</span>
        <Input
          required
          value={customer.phone}
          onChange={(event) => {
            setCustomer((current) => ({
              ...current,
              phone: event.target.value,
            }))
          }}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">{labels.email}</span>
        <Input
          type="email"
          value={customer.email ?? ''}
          onChange={(event) => {
            setCustomer((current) => ({
              ...current,
              email: event.target.value || null,
            }))
          }}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">{labels.deliveryAddress}</span>
        <Input
          value={customer.deliveryAddress ?? ''}
          onChange={(event) => {
            setCustomer((current) => ({
              ...current,
              deliveryAddress: event.target.value || null,
            }))
          }}
        />
      </label>
      <Button
        fullWidth
        disabled={disabled}
        isLoading={Boolean(disabled)}
        type="submit"
      >
        {labels.submit}
      </Button>
    </form>
  )
}

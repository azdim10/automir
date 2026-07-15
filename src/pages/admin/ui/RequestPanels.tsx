import { useMemo, useState } from 'react'

import type { AdminOrderRecord } from '@entities/admin'
import type { TableRow } from '@shared/api/supabase'
import { formatCurrency } from '@shared/lib/format'
import { cn } from '@shared/lib/styles/cn'
import {
  Button,
  Card,
  CardContent,
  Modal,
  Select,
  Typography,
} from '@shared/ui'

import {
  countNewRequests,
  getRequestCardClassName,
  getRequestStatusLabel,
  REQUEST_STATUS_OPTIONS,
  sortRequestsByStatus,
} from '../lib/requestStatus'

function RequestCountBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null
  }

  return (
    <span className="ml-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

interface RequestsAdminProps {
  callbacks: TableRow<'callback_requests'>[]
  labels: {
    callbacks: string
    orders: string
    status: string
  }
  locale: string
  orders: AdminOrderRecord[]
  activeSection: 'orders' | 'callbacks'
  onCallbackStatusChange: (id: string, status: string) => void
  onOrderStatusChange: (id: string, status: string) => void
  onSectionChange: (section: 'orders' | 'callbacks') => void
}

export function RequestsAdmin({
  activeSection,
  callbacks,
  labels,
  locale,
  orders,
  onCallbackStatusChange,
  onOrderStatusChange,
  onSectionChange,
}: RequestsAdminProps) {
  const newOrdersCount = useMemo(() => countNewRequests(orders.map((r) => r.order)), [orders])
  const newCallbacksCount = useMemo(() => countNewRequests(callbacks), [callbacks])

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeSection === 'orders' ? 'primary' : 'outline'}
          onClick={() => {
            onSectionChange('orders')
          }}
        >
          <span className="inline-flex items-center">
            {labels.orders}
            <RequestCountBadge count={newOrdersCount} />
          </span>
        </Button>
        <Button
          variant={activeSection === 'callbacks' ? 'primary' : 'outline'}
          onClick={() => {
            onSectionChange('callbacks')
          }}
        >
          <span className="inline-flex items-center">
            {labels.callbacks}
            <RequestCountBadge count={newCallbacksCount} />
          </span>
        </Button>
      </div>
      {activeSection === 'orders' ? (
        <OrdersAdmin
          labels={labels}
          locale={locale}
          orders={orders}
          onStatusChange={onOrderStatusChange}
        />
      ) : null}
      {activeSection === 'callbacks' ? (
        <CallbacksAdmin
          callbacks={callbacks}
          labels={labels}
          locale={locale}
          onStatusChange={onCallbackStatusChange}
        />
      ) : null}
    </div>
  )
}

interface OrdersAdminProps {
  labels: {
    status: string
  }
  locale: string
  orders: AdminOrderRecord[]
  onStatusChange: (id: string, status: string) => void
}

function OrdersAdmin({ labels, locale, orders, onStatusChange }: OrdersAdminProps) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null)
  const sortedOrders = useMemo(
    () => sortRequestsByStatus(orders.map((record) => record.order)).map((order) => {
      return orders.find((record) => record.order.id === order.id) ?? {
        items: [],
        order,
      }
    }),
    [orders],
  )

  return (
    <>
      <div className="grid gap-3">
        {sortedOrders.map((record) => (
          <Card
            className={cn('transition-colors', getRequestCardClassName(record.order.status))}
            key={record.order.id}
          >
            <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
              <button
                className="grid gap-1 text-left"
                type="button"
                onClick={() => {
                  setSelectedOrder(record)
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Typography as="h3" variant="h3" weight="semibold">
                    {record.order.customer_name}
                  </Typography>
                  {record.order.status === 'new' ? (
                    <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {getRequestStatusLabel(record.order.status)}
                    </span>
                  ) : null}
                </div>
                <Typography className="text-slate-500" variant="body-sm">
                  {record.order.customer_phone}
                  {record.order.customer_email
                    ? ` · ${record.order.customer_email}`
                    : null}
                </Typography>
                <Typography variant="body-sm" weight="semibold">
                  {formatCurrency(record.order.total_amount, locale)}
                </Typography>
                <Typography className="text-slate-400" variant="caption">
                  {new Date(record.order.created_at).toLocaleString(locale)}
                </Typography>
              </button>
              <div
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <Select
                  aria-label={labels.status}
                  value={record.order.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onChange={(event) => {
                    onStatusChange(record.order.id, event.target.value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <OrderDetailsModal
        isOpen={selectedOrder !== null}
        locale={locale}
        record={selectedOrder}
        onClose={() => {
          setSelectedOrder(null)
        }}
        onStatusChange={onStatusChange}
      />
    </>
  )
}

interface OrderDetailsModalProps {
  isOpen: boolean
  locale: string
  record: AdminOrderRecord | null
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}

function OrderDetailsModal({
  isOpen,
  locale,
  record,
  onClose,
  onStatusChange,
}: OrderDetailsModalProps) {
  if (!record) {
    return null
  }

  const { items, order } = record

  return (
    <Modal isOpen={isOpen} size="lg" title="Заказ" onClose={onClose}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Typography className="text-slate-500" variant="caption">
            № {order.id}
          </Typography>
          <Typography variant="body-sm">
            {new Date(order.created_at).toLocaleString(locale)}
          </Typography>
        </div>
        <div className="grid gap-2 rounded-lg border border-slate-200 p-3">
          <Typography as="h3" variant="body" weight="semibold">
            Клиент
          </Typography>
          <Typography variant="body-sm">{order.customer_name}</Typography>
          <Typography variant="body-sm">{order.customer_phone}</Typography>
          {order.customer_email ? (
            <Typography variant="body-sm">{order.customer_email}</Typography>
          ) : null}
          {order.delivery_address ? (
            <Typography variant="body-sm">{order.delivery_address}</Typography>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Typography as="h3" variant="body" weight="semibold">
            Статус
          </Typography>
          <Select
            value={order.status}
            options={REQUEST_STATUS_OPTIONS}
            onChange={(event) => {
              onStatusChange(order.id, event.target.value)
            }}
          />
        </div>
        <div className="grid gap-2">
          <Typography as="h3" variant="body" weight="semibold">
            Товары
          </Typography>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 font-medium">Товар</th>
                  <th className="px-3 py-2 font-medium">Артикул</th>
                  <th className="px-3 py-2 font-medium">Кол-во</th>
                  <th className="px-3 py-2 font-medium">Цена</th>
                  <th className="px-3 py-2 font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr className="border-t border-slate-200" key={item.id}>
                    <td className="px-3 py-2">{item.product_name}</td>
                    <td className="px-3 py-2 text-slate-500">{item.product_sku}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">
                      {formatCurrency(item.unit_price, locale)}
                    </td>
                    <td className="px-3 py-2">
                      {formatCurrency(item.total_price, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Typography as="p" variant="body" weight="semibold">
          Итого: {formatCurrency(order.total_amount, locale)}
        </Typography>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  )
}

interface CallbacksAdminProps {
  callbacks: TableRow<'callback_requests'>[]
  labels: {
    status: string
  }
  locale: string
  onStatusChange: (id: string, status: string) => void
}

function CallbacksAdmin({
  callbacks,
  labels,
  locale,
  onStatusChange,
}: CallbacksAdminProps) {
  const [selectedCallback, setSelectedCallback] =
    useState<TableRow<'callback_requests'> | null>(null)
  const sortedCallbacks = useMemo(
    () => sortRequestsByStatus(callbacks),
    [callbacks],
  )

  return (
    <>
      <div className="grid gap-3">
        {sortedCallbacks.map((callback) => (
          <Card
            className={cn('transition-colors', getRequestCardClassName(callback.status))}
            key={callback.id}
          >
            <CardContent className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
              <button
                className="grid gap-1 text-left"
                type="button"
                onClick={() => {
                  setSelectedCallback(callback)
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Typography as="h3" variant="h3" weight="semibold">
                    {callback.customer_name}
                  </Typography>
                  {callback.status === 'new' ? (
                    <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                      {getRequestStatusLabel(callback.status)}
                    </span>
                  ) : null}
                </div>
                <Typography className="text-slate-500" variant="body-sm">
                  {callback.customer_phone}
                </Typography>
                <Typography className="text-slate-400" variant="caption">
                  {new Date(callback.created_at).toLocaleString(locale)}
                </Typography>
              </button>
              <div
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <Select
                  aria-label={labels.status}
                  value={callback.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onChange={(event) => {
                    onStatusChange(callback.id, event.target.value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <CallbackDetailsModal
        callback={selectedCallback}
        isOpen={selectedCallback !== null}
        locale={locale}
        onClose={() => {
          setSelectedCallback(null)
        }}
        onStatusChange={onStatusChange}
      />
    </>
  )
}

interface CallbackDetailsModalProps {
  callback: TableRow<'callback_requests'> | null
  isOpen: boolean
  locale: string
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}

function CallbackDetailsModal({
  callback,
  isOpen,
  locale,
  onClose,
  onStatusChange,
}: CallbackDetailsModalProps) {
  if (!callback) {
    return null
  }

  return (
    <Modal isOpen={isOpen} size="md" title="Заявка на звонок" onClose={onClose}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Typography className="text-slate-500" variant="caption">
            № {callback.id}
          </Typography>
          <Typography variant="body-sm">
            {new Date(callback.created_at).toLocaleString(locale)}
          </Typography>
        </div>
        <div className="grid gap-2 rounded-lg border border-slate-200 p-3">
          <Typography variant="body-sm" weight="semibold">
            {callback.customer_name}
          </Typography>
          <Typography variant="body-sm">
            <a
              className="text-slate-900 hover:underline"
              href={`tel:${callback.customer_phone.replace(/[^\d+]/g, '')}`}
            >
              {callback.customer_phone}
            </a>
          </Typography>
        </div>
        <div className="grid gap-2">
          <Typography as="h3" variant="body" weight="semibold">
            Статус
          </Typography>
          <Select
            value={callback.status}
            options={REQUEST_STATUS_OPTIONS}
            onChange={(event) => {
              onStatusChange(callback.id, event.target.value)
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  )
}

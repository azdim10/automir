import { useMemo, useState, type PointerEvent } from 'react'

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
  getRequestStatusBadgeClassName,
  getRequestStatusLabel,
  groupRequestsByStatus,
  REQUEST_STATUS_OPTIONS,
  type RequestReorderUpdate,
} from '../lib/requestStatus'
import { RequestKanbanBoard } from './RequestKanbanBoard'

function stopDragPointer(event: PointerEvent) {
  event.stopPropagation()
}

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

function RequestStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide',
        getRequestStatusBadgeClassName(status),
      )}
    >
      {getRequestStatusLabel(status)}
    </span>
  )
}

interface RequestsAdminProps {
  callbacks: TableRow<'callback_requests'>[]
  labels: {
    callbacks: string
    delete: string
    orders: string
    status: string
  }
  locale: string
  orders: AdminOrderRecord[]
  activeSection: 'orders' | 'callbacks'
  onCallbackDelete: (id: string) => void
  onCallbackReorder: (updates: RequestReorderUpdate[]) => void
  onCallbackStatusChange: (id: string, status: string) => void
  onClearCancelledCallbacks: () => void
  onClearCancelledOrders: () => void
  onOrderDelete: (id: string) => void
  onOrderReorder: (updates: RequestReorderUpdate[]) => void
  onOrderStatusChange: (id: string, status: string) => void
  onSectionChange: (section: 'orders' | 'callbacks') => void
}

export function RequestsAdmin({
  activeSection,
  callbacks,
  labels,
  locale,
  orders,
  onCallbackDelete,
  onCallbackReorder,
  onCallbackStatusChange,
  onClearCancelledCallbacks,
  onClearCancelledOrders,
  onOrderDelete,
  onOrderReorder,
  onOrderStatusChange,
  onSectionChange,
}: RequestsAdminProps) {
  const newOrdersCount = useMemo(
    () => countNewRequests(orders.map((record) => record.order)),
    [orders],
  )
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
          deleteLabel={labels.delete}
          labels={labels}
          locale={locale}
          orders={orders}
          onClearCancelled={onClearCancelledOrders}
          onDelete={onOrderDelete}
          onReorder={onOrderReorder}
          onStatusChange={onOrderStatusChange}
        />
      ) : null}
      {activeSection === 'callbacks' ? (
        <CallbacksAdmin
          callbacks={callbacks}
          deleteLabel={labels.delete}
          labels={labels}
          locale={locale}
          onClearCancelled={onClearCancelledCallbacks}
          onDelete={onCallbackDelete}
          onReorder={onCallbackReorder}
          onStatusChange={onCallbackStatusChange}
        />
      ) : null}
    </div>
  )
}

interface OrdersAdminProps {
  deleteLabel: string
  labels: {
    status: string
  }
  locale: string
  orders: AdminOrderRecord[]
  onClearCancelled: () => void
  onDelete: (id: string) => void
  onReorder: (updates: RequestReorderUpdate[]) => void
  onStatusChange: (id: string, status: string) => void
}

function OrdersAdmin({
  deleteLabel,
  labels,
  locale,
  orders,
  onClearCancelled,
  onDelete,
  onReorder,
  onStatusChange,
}: OrdersAdminProps) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null)
  const groupedOrders = useMemo(
    () =>
      groupRequestsByStatus(
        orders,
        (record) => record.order.status,
        (record) => record.order.sort_order,
      ),
    [orders],
  )

  return (
    <>
      <RequestKanbanBoard
        clearCancelledLabel="Очистить все"
        getItemId={(record) => record.order.id}
        itemsByStatus={groupedOrders}
        onClearCancelled={onClearCancelled}
        onReorder={onReorder}
        renderCard={(record) => (
          <Card
            className={cn('transition-colors', getRequestCardClassName(record.order.status))}
          >
            <CardContent className="grid gap-3 p-3">
              <button
                className="grid gap-1 text-left"
                type="button"
                onClick={() => {
                  setSelectedOrder(record)
                }}
                onPointerDown={stopDragPointer}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Typography as="h3" variant="body" weight="semibold">
                    {record.order.customer_name}
                  </Typography>
                  <RequestStatusBadge status={record.order.status} />
                </div>
                <Typography className="text-slate-500" variant="body-sm">
                  {record.order.customer_phone}
                </Typography>
                <Typography variant="body-sm" weight="semibold">
                  {formatCurrency(record.order.total_amount, locale)}
                </Typography>
                <Typography className="text-slate-400" variant="caption">
                  {new Date(record.order.created_at).toLocaleString(locale)}
                </Typography>
              </button>
              <div onPointerDown={stopDragPointer}>
                <Select
                  aria-label={labels.status}
                  value={record.order.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onChange={(event) => {
                    onStatusChange(record.order.id, event.target.value)
                  }}
                />
              </div>
              <Button
                className="h-8"
                variant="outline"
                onClick={() => {
                  onDelete(record.order.id)
                }}
                onPointerDown={stopDragPointer}
              >
                {deleteLabel}
              </Button>
            </CardContent>
          </Card>
        )}
      />
      <OrderDetailsModal
        deleteLabel={deleteLabel}
        isOpen={selectedOrder !== null}
        locale={locale}
        record={selectedOrder}
        onClose={() => {
          setSelectedOrder(null)
        }}
        onDelete={(id) => {
          onDelete(id)
          setSelectedOrder(null)
        }}
        onStatusChange={onStatusChange}
      />
    </>
  )
}

interface OrderDetailsModalProps {
  deleteLabel: string
  isOpen: boolean
  locale: string
  record: AdminOrderRecord | null
  onClose: () => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
}

function OrderDetailsModal({
  deleteLabel,
  isOpen,
  locale,
  record,
  onClose,
  onDelete,
  onStatusChange,
}: OrderDetailsModalProps) {
  if (!record) {
    return null
  }

  const { items, order } = record

  return (
    <Modal isOpen={isOpen} size="lg" title="Заказ" onClose={onClose}>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <RequestStatusBadge status={order.status} />
          <Typography className="text-slate-500" variant="caption">
            № {order.id}
          </Typography>
        </div>
        <Typography variant="body-sm">
          {new Date(order.created_at).toLocaleString(locale)}
        </Typography>
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
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onDelete(order.id)
            }}
          >
            {deleteLabel}
          </Button>
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
  deleteLabel: string
  labels: {
    status: string
  }
  locale: string
  onClearCancelled: () => void
  onDelete: (id: string) => void
  onReorder: (updates: RequestReorderUpdate[]) => void
  onStatusChange: (id: string, status: string) => void
}

function CallbacksAdmin({
  callbacks,
  deleteLabel,
  labels,
  locale,
  onClearCancelled,
  onDelete,
  onReorder,
  onStatusChange,
}: CallbacksAdminProps) {
  const [selectedCallback, setSelectedCallback] =
    useState<TableRow<'callback_requests'> | null>(null)
  const groupedCallbacks = useMemo(
    () =>
      groupRequestsByStatus(
        callbacks,
        (callback) => callback.status,
        (callback) => callback.sort_order,
      ),
    [callbacks],
  )

  return (
    <>
      <RequestKanbanBoard
        clearCancelledLabel="Очистить все"
        getItemId={(callback) => callback.id}
        itemsByStatus={groupedCallbacks}
        onClearCancelled={onClearCancelled}
        onReorder={onReorder}
        renderCard={(callback) => (
          <Card
            className={cn('transition-colors', getRequestCardClassName(callback.status))}
          >
            <CardContent className="grid gap-3 p-3">
              <button
                className="grid gap-1 text-left"
                type="button"
                onClick={() => {
                  setSelectedCallback(callback)
                }}
                onPointerDown={stopDragPointer}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Typography as="h3" variant="body" weight="semibold">
                    {callback.customer_name}
                  </Typography>
                  <RequestStatusBadge status={callback.status} />
                </div>
                <Typography className="text-slate-500" variant="body-sm">
                  {callback.customer_phone}
                </Typography>
                <Typography className="text-slate-400" variant="caption">
                  {new Date(callback.created_at).toLocaleString(locale)}
                </Typography>
              </button>
              <div onPointerDown={stopDragPointer}>
                <Select
                  aria-label={labels.status}
                  value={callback.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onChange={(event) => {
                    onStatusChange(callback.id, event.target.value)
                  }}
                />
              </div>
              <Button
                className="h-8"
                variant="outline"
                onClick={() => {
                  onDelete(callback.id)
                }}
                onPointerDown={stopDragPointer}
              >
                {deleteLabel}
              </Button>
            </CardContent>
          </Card>
        )}
      />
      <CallbackDetailsModal
        callback={selectedCallback}
        deleteLabel={deleteLabel}
        isOpen={selectedCallback !== null}
        locale={locale}
        onClose={() => {
          setSelectedCallback(null)
        }}
        onDelete={(id) => {
          onDelete(id)
          setSelectedCallback(null)
        }}
        onStatusChange={onStatusChange}
      />
    </>
  )
}

interface CallbackDetailsModalProps {
  callback: TableRow<'callback_requests'> | null
  deleteLabel: string
  isOpen: boolean
  locale: string
  onClose: () => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
}

function CallbackDetailsModal({
  callback,
  deleteLabel,
  isOpen,
  locale,
  onClose,
  onDelete,
  onStatusChange,
}: CallbackDetailsModalProps) {
  if (!callback) {
    return null
  }

  return (
    <Modal isOpen={isOpen} size="md" title="Заявка на звонок" onClose={onClose}>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <RequestStatusBadge status={callback.status} />
          <Typography className="text-slate-500" variant="caption">
            № {callback.id}
          </Typography>
        </div>
        <Typography variant="body-sm">
          {new Date(callback.created_at).toLocaleString(locale)}
        </Typography>
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
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onDelete(callback.id)
            }}
          >
            {deleteLabel}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  )
}

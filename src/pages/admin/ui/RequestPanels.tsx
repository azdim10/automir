import { useMemo, useState, type ReactNode } from 'react'

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
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_OPTIONS,
  REQUEST_STATUSES,
  REQUEST_STATUS_THEME,
  type RequestStatus,
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

interface RequestKanbanColumnProps {
  children: ReactNode
  count: number
  status: RequestStatus
}

function RequestKanbanColumn({ children, count, status }: RequestKanbanColumnProps) {
  const theme = REQUEST_STATUS_THEME[status]

  return (
    <section
      className={cn(
        'flex min-h-[18rem] min-w-[15rem] flex-1 flex-col rounded-xl border p-3',
        theme.columnClassName,
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn('size-2.5 rounded-full', theme.dotClassName)} />
          <Typography as="h3" variant="body-sm" weight="semibold">
            {REQUEST_STATUS_LABELS[status]}
          </Typography>
        </div>
        <span
          className={cn(
            'inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
            theme.badgeClassName,
          )}
        >
          {count}
        </span>
      </header>
      <div className="grid flex-1 gap-2">{children}</div>
    </section>
  )
}

interface RequestKanbanBoardProps {
  children: (status: RequestStatus) => ReactNode
  getColumnCount: (status: RequestStatus) => number
}

function RequestKanbanBoard({ children, getColumnCount }: RequestKanbanBoardProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-full gap-4">
        {REQUEST_STATUSES.map((status) => (
          <RequestKanbanColumn
            count={getColumnCount(status)}
            key={status}
            status={status}
          >
            {children(status)}
          </RequestKanbanColumn>
        ))}
      </div>
    </div>
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
  const groupedOrders = useMemo(
    () =>
      groupRequestsByStatus(
        orders,
        (record) => record.order.status,
        (record) => record.order.created_at,
      ),
    [orders],
  )

  return (
    <>
      <RequestKanbanBoard
        getColumnCount={(status) => groupedOrders[status].length}
      >
        {(status) =>
          groupedOrders[status].map((record) => (
            <Card
              className={cn('transition-colors', getRequestCardClassName(record.order.status))}
              key={record.order.id}
            >
              <CardContent className="grid gap-3 p-3">
                <button
                  className="grid gap-1 text-left"
                  type="button"
                  onClick={() => {
                    setSelectedOrder(record)
                  }}
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
                <Select
                  aria-label={labels.status}
                  value={record.order.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  onChange={(event) => {
                    onStatusChange(record.order.id, event.target.value)
                  }}
                />
              </CardContent>
            </Card>
          ))
        }
      </RequestKanbanBoard>
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
  const groupedCallbacks = useMemo(
    () =>
      groupRequestsByStatus(
        callbacks,
        (callback) => callback.status,
        (callback) => callback.created_at,
      ),
    [callbacks],
  )

  return (
    <>
      <RequestKanbanBoard
        getColumnCount={(status) => groupedCallbacks[status].length}
      >
        {(status) =>
          groupedCallbacks[status].map((callback) => (
            <Card
              className={cn('transition-colors', getRequestCardClassName(callback.status))}
              key={callback.id}
            >
              <CardContent className="grid gap-3 p-3">
                <button
                  className="grid gap-1 text-left"
                  type="button"
                  onClick={() => {
                    setSelectedCallback(callback)
                  }}
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
                <Select
                  aria-label={labels.status}
                  value={callback.status}
                  options={REQUEST_STATUS_OPTIONS}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  onChange={(event) => {
                    onStatusChange(callback.id, event.target.value)
                  }}
                />
              </CardContent>
            </Card>
          ))
        }
      </RequestKanbanBoard>
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
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  )
}

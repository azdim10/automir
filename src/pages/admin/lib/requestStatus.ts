export const REQUEST_STATUSES = [
  'new',
  'processing',
  'completed',
  'cancelled',
] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  cancelled: 'Неактуально',
  completed: 'Завершен',
  new: 'Новый',
  processing: 'В работе',
}

export const REQUEST_STATUS_OPTIONS = REQUEST_STATUSES.map((status) => ({
  label: REQUEST_STATUS_LABELS[status],
  value: status,
}))

export const REQUEST_STATUS_THEME: Record<
  RequestStatus,
  {
    badgeClassName: string
    cardClassName: string
    columnClassName: string
    dotClassName: string
  }
> = {
  cancelled: {
    badgeClassName: 'bg-slate-400 text-white',
    cardClassName: 'border-slate-200 bg-slate-50/90 opacity-80',
    columnClassName: 'border-slate-200 bg-slate-50/70',
    dotClassName: 'bg-slate-400',
  },
  completed: {
    badgeClassName: 'bg-emerald-600 text-white',
    cardClassName:
      'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white shadow-sm ring-1 ring-emerald-100',
    columnClassName: 'border-emerald-100 bg-emerald-50/40',
    dotClassName: 'bg-emerald-500',
  },
  new: {
    badgeClassName: 'bg-sky-600 text-white',
    cardClassName:
      'border-sky-200 bg-gradient-to-br from-sky-50/90 to-white shadow-sm ring-1 ring-sky-100',
    columnClassName: 'border-sky-100 bg-sky-50/50',
    dotClassName: 'bg-sky-500',
  },
  processing: {
    badgeClassName: 'bg-amber-500 text-white',
    cardClassName:
      'border-amber-200 bg-gradient-to-br from-amber-50/80 to-white shadow-sm ring-1 ring-amber-100',
    columnClassName: 'border-amber-100 bg-amber-50/40',
    dotClassName: 'bg-amber-500',
  },
}

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus)
}

export function normalizeRequestStatus(status: string): RequestStatus {
  return isRequestStatus(status) ? status : 'new'
}

export function groupRequestsByStatus<T>(
  items: T[],
  getStatus: (item: T) => string,
  getCreatedAt: (item: T) => string = () => '',
): Record<RequestStatus, T[]> {
  const grouped = Object.fromEntries(
    REQUEST_STATUSES.map((status) => [status, [] as T[]]),
  ) as Record<RequestStatus, T[]>

  for (const item of items) {
    const status = normalizeRequestStatus(getStatus(item))
    grouped[status].push(item)
  }

  for (const status of REQUEST_STATUSES) {
    grouped[status] = [...grouped[status]].sort(
      (left, right) =>
        new Date(getCreatedAt(right)).getTime() - new Date(getCreatedAt(left)).getTime(),
    )
  }

  return grouped
}

export function countNewRequests<T extends { status: string }>(items: T[]): number {
  return items.filter((item) => item.status === 'new').length
}

export function getRequestCardClassName(status: string): string {
  return REQUEST_STATUS_THEME[normalizeRequestStatus(status)].cardClassName
}

export function getRequestStatusBadgeClassName(status: string): string {
  return REQUEST_STATUS_THEME[normalizeRequestStatus(status)].badgeClassName
}

export function getRequestStatusLabel(status: string): string {
  return REQUEST_STATUS_LABELS[normalizeRequestStatus(status)]
}

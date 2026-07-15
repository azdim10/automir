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

const REQUEST_STATUS_SORT_ORDER: Record<RequestStatus, number> = {
  cancelled: 3,
  completed: 2,
  new: 0,
  processing: 1,
}

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus)
}

export function sortRequestsByStatus<T extends { created_at: string; status: string }>(
  items: T[],
): T[] {
  return [...items].sort((left, right) => {
    const leftStatus = isRequestStatus(left.status) ? left.status : 'new'
    const rightStatus = isRequestStatus(right.status) ? right.status : 'new'
    const statusDiff =
      REQUEST_STATUS_SORT_ORDER[leftStatus] -
      REQUEST_STATUS_SORT_ORDER[rightStatus]

    if (statusDiff !== 0) {
      return statusDiff
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    )
  })
}

export function countNewRequests<T extends { status: string }>(items: T[]): number {
  return items.filter((item) => item.status === 'new').length
}

export function getRequestCardClassName(status: string): string {
  if (status === 'cancelled') {
    return 'border-slate-200 bg-slate-50/90 opacity-70'
  }

  if (status === 'new') {
    return 'border-sky-200 bg-gradient-to-r from-sky-50 via-white to-white shadow-sm ring-1 ring-sky-100'
  }

  return 'border-slate-200'
}

export function getRequestStatusLabel(status: string): string {
  if (isRequestStatus(status)) {
    return REQUEST_STATUS_LABELS[status]
  }

  return status
}

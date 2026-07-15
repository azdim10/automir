import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { cn } from '@shared/lib/styles/cn'
import { Button, Typography } from '@shared/ui'

import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUSES,
  REQUEST_STATUS_THEME,
  type RequestReorderUpdate,
  type RequestStatus,
} from '../lib/requestStatus'

type RequestKanbanColumns<T> = Record<RequestStatus, T[]>

interface RequestKanbanBoardProps<T> {
  clearCancelledLabel?: string
  getItemId: (item: T) => string
  itemsByStatus: RequestKanbanColumns<T>
  onClearCancelled?: () => void
  onReorder: (updates: RequestReorderUpdate[]) => void
  renderCard: (item: T) => ReactNode
}

function buildReorderUpdates<T>(
  columns: RequestKanbanColumns<T>,
  getItemId: (item: T) => string,
): RequestReorderUpdate[] {
  const updates: RequestReorderUpdate[] = []

  for (const status of REQUEST_STATUSES) {
    columns[status].forEach((item, index) => {
      updates.push({
        id: getItemId(item),
        sort_order: index,
        status,
      })
    })
  }

  return updates
}

function diffReorderUpdates(
  previous: RequestReorderUpdate[],
  next: RequestReorderUpdate[],
): RequestReorderUpdate[] {
  const previousById = new Map(previous.map((update) => [update.id, update]))

  return next.filter((update) => {
    const current = previousById.get(update.id)

    return (
      !current ||
      current.sort_order !== update.sort_order ||
      current.status !== update.status
    )
  })
}

function findContainerId<T>(
  id: UniqueIdentifier,
  columns: RequestKanbanColumns<T>,
  getItemId: (item: T) => string,
): RequestStatus | null {
  if (REQUEST_STATUSES.includes(id as RequestStatus)) {
    return id as RequestStatus
  }

  for (const status of REQUEST_STATUSES) {
    if (columns[status].some((item) => getItemId(item) === id)) {
      return status
    }
  }

  return null
}

function moveItemBetweenContainers<T>({
  activeId,
  activeContainer,
  columns,
  getItemId,
  overContainer,
  overId,
}: {
  activeId: UniqueIdentifier
  activeContainer: RequestStatus
  columns: RequestKanbanColumns<T>
  getItemId: (item: T) => string
  overContainer: RequestStatus
  overId: UniqueIdentifier
}): RequestKanbanColumns<T> {
  const activeItems = [...columns[activeContainer]]
  const overItems = [...columns[overContainer]]
  const activeIndex = activeItems.findIndex((item) => getItemId(item) === activeId)

  if (activeIndex === -1) {
    return columns
  }

  const [movedItem] = activeItems.splice(activeIndex, 1)

  if (!movedItem) {
    return columns
  }

  const overIndex = REQUEST_STATUSES.includes(overId as RequestStatus)
    ? overItems.length
    : overItems.findIndex((item) => getItemId(item) === overId)

  overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, movedItem)

  return {
    ...columns,
    [activeContainer]: activeItems,
    [overContainer]: overItems,
  }
}

const kanbanCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)

  if (pointerCollisions.length > 0) {
    return pointerCollisions
  }

  return rectIntersection(args)
}

interface SortableRequestCardProps {
  children: ReactNode
  id: string
}

function SortableRequestCard({ children, id }: SortableRequestCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  return (
    <div
      className={cn(
        'touch-none',
        isDragging ? 'z-10 opacity-40' : undefined,
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <div className={cn(isDragging ? 'cursor-grabbing' : 'cursor-grab')}>
        {children}
      </div>
    </div>
  )
}

interface RequestKanbanColumnProps {
  children: ReactNode
  clearLabel?: string
  count: number
  itemIds: string[]
  onClear?: () => void
  status: RequestStatus
}

function RequestKanbanColumn({
  children,
  clearLabel,
  count,
  itemIds,
  onClear,
  status,
}: RequestKanbanColumnProps) {
  const theme = REQUEST_STATUS_THEME[status]
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <section
      className={cn(
        'flex min-h-[18rem] min-w-[15rem] flex-1 flex-col rounded-xl border p-3 transition-colors',
        theme.columnClassName,
      )}
    >
      <header className="mb-3 grid gap-2">
        <div className="flex items-center justify-between gap-2">
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
        </div>
        {onClear && count > 0 && clearLabel ? (
          <Button
            className="h-8 w-full text-xs"
            variant="outline"
            onClick={onClear}
          >
            {clearLabel}
          </Button>
        ) : null}
      </header>
      <div
        className={cn(
          'grid min-h-[12rem] flex-1 gap-2 rounded-lg p-1 transition-colors',
          isOver ? 'bg-white/60 ring-2 ring-slate-300' : undefined,
        )}
        ref={setNodeRef}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </section>
  )
}

export function RequestKanbanBoard<T>({
  clearCancelledLabel,
  getItemId,
  itemsByStatus,
  onClearCancelled,
  onReorder,
  renderCard,
}: RequestKanbanBoardProps<T>) {
  const [columns, setColumns] = useState(itemsByStatus)
  const [activeId, setActiveId] = useState<string | null>(null)
  const columnsRef = useRef(columns)

  useEffect(() => {
    setColumns(itemsByStatus)
    columnsRef.current = itemsByStatus
  }, [itemsByStatus])

  const setColumnsState = (next: RequestKanbanColumns<T>) => {
    columnsRef.current = next
    setColumns(next)
  }

  const persistedUpdates = useMemo(
    () => buildReorderUpdates(itemsByStatus, getItemId),
    [getItemId, itemsByStatus],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeItem = useMemo(() => {
    if (!activeId) {
      return null
    }

    for (const status of REQUEST_STATUSES) {
      const item = columns[status].find(
        (entry) => getItemId(entry) === activeId,
      )

      if (item) {
        return item
      }
    }

    return null
  }, [activeId, columns, getItemId])

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id))
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return
    }

    const activeContainer = findContainerId(
      active.id,
      columnsRef.current,
      getItemId,
    )
    const overContainer = findContainerId(over.id, columnsRef.current, getItemId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setColumnsState(
      moveItemBetweenContainers({
        activeId: active.id,
        activeContainer,
        columns: columnsRef.current,
        getItemId,
        overContainer,
        overId: over.id,
      }),
    )
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)

    if (!over) {
      setColumnsState(itemsByStatus)
      return
    }

    const current = columnsRef.current
    const activeContainer = findContainerId(active.id, current, getItemId)
    const overContainer = findContainerId(over.id, current, getItemId)

    if (!activeContainer || !overContainer) {
      setColumnsState(itemsByStatus)
      return
    }

    let nextColumns = current

    if (activeContainer !== overContainer) {
      nextColumns = moveItemBetweenContainers({
        activeId: active.id,
        activeContainer,
        columns: current,
        getItemId,
        overContainer,
        overId: over.id,
      })
    } else {
      const items = [...current[activeContainer]]
      const activeIndex = items.findIndex((item) => getItemId(item) === active.id)
      const overIndex = REQUEST_STATUSES.includes(over.id as RequestStatus)
        ? items.length - 1
        : items.findIndex((item) => getItemId(item) === over.id)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        nextColumns = {
          ...current,
          [activeContainer]: arrayMove(items, activeIndex, overIndex),
        }
      }
    }

    setColumnsState(nextColumns)

    const updates = diffReorderUpdates(
      persistedUpdates,
      buildReorderUpdates(nextColumns, getItemId),
    )

    if (updates.length > 0) {
      onReorder(updates)
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setColumnsState(itemsByStatus)
  }

  return (
    <DndContext
      collisionDetection={kanbanCollisionDetection}
      sensors={sensors}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-full gap-4">
          {REQUEST_STATUSES.map((status) => {
            const items = columns[status]
            const itemIds = items.map((item) => getItemId(item))

            return (
              <RequestKanbanColumn
                count={items.length}
                itemIds={itemIds}
                key={status}
                status={status}
                {...(status === 'cancelled' && onClearCancelled && clearCancelledLabel
                  ? {
                      clearLabel: clearCancelledLabel,
                      onClear: onClearCancelled,
                    }
                  : {})}
              >
                {items.map((item) => (
                  <SortableRequestCard id={getItemId(item)} key={getItemId(item)}>
                    {renderCard(item)}
                  </SortableRequestCard>
                ))}
              </RequestKanbanColumn>
            )
          })}
        </div>
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="cursor-grabbing opacity-95 shadow-lg">{renderCard(activeItem)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

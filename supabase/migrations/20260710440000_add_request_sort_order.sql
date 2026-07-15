alter table public.orders
  add column if not exists sort_order integer not null default 0;

alter table public.callback_requests
  add column if not exists sort_order integer not null default 0;

with ranked_orders as (
  select
    id,
    row_number() over (
      partition by status
      order by created_at desc
    ) - 1 as next_sort_order
  from public.orders
)
update public.orders as target
set sort_order = ranked_orders.next_sort_order
from ranked_orders
where target.id = ranked_orders.id;

with ranked_callbacks as (
  select
    id,
    row_number() over (
      partition by status
      order by created_at desc
    ) - 1 as next_sort_order
  from public.callback_requests
)
update public.callback_requests as target
set sort_order = ranked_callbacks.next_sort_order
from ranked_callbacks
where target.id = ranked_callbacks.id;

create index if not exists idx_orders_status_sort
  on public.orders(status, sort_order);

create index if not exists idx_callback_requests_status_sort
  on public.callback_requests(status, sort_order);

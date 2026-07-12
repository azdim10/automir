create table public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  customer_name text not null,
  customer_phone text not null,
  created_at timestamptz not null default now()
);

create index idx_callback_requests_status_created
  on public.callback_requests(status, created_at desc);

alter table public.callback_requests enable row level security;

create policy "public can create callback requests"
  on public.callback_requests for insert
  with check (status = 'new');

create policy "authenticated can read callback requests"
  on public.callback_requests for select
  to authenticated
  using (true);

create policy "authenticated can update callback requests"
  on public.callback_requests for update
  to authenticated
  using (true)
  with check (true);

insert into public.site_settings (key, value)
values
  (
    'callback_labels',
    '{
      "title": "Заказать звонок",
      "description": "Оставьте контакты и мы перезвоним вам",
      "name": "Имя",
      "phone": "Телефон",
      "submit": "Отправить",
      "success": "Заявка отправлена. Мы скоро свяжемся с вами",
      "error": "Не удалось отправить заявку. Попробуйте еще раз",
      "close": "Закрыть",
      "requestCall": "Заказать звонок"
    }'::jsonb
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

update public.site_settings
set value = jsonb_set(
  value,
  '{callbacks}',
  '"Заявки на звонок"'::jsonb,
  true
),
updated_at = now()
where key = 'admin_labels'
  and not (value ? 'callbacks');


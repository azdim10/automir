alter table public.products
  add column if not exists product_type text,
  add column if not exists packing_norm text,
  add column if not exists application_area text,
  add column if not exists sketch_url text,
  add column if not exists sketch_alt text;

create table if not exists public.product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  sort_order integer not null default 0
);

create table if not exists public.product_modifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  designation text not null,
  features text not null default '',
  applicability text not null default '',
  sort_order integer not null default 0
);

create index if not exists idx_product_specifications_product_order
  on public.product_specifications(product_id, sort_order);

create index if not exists idx_product_modifications_product_order
  on public.product_modifications(product_id, sort_order);

alter table public.product_specifications enable row level security;
alter table public.product_modifications enable row level security;

drop policy if exists "public can read product specifications" on public.product_specifications;
drop policy if exists "public can read product modifications" on public.product_modifications;
drop policy if exists "authenticated can manage product specifications" on public.product_specifications;
drop policy if exists "authenticated can manage product modifications" on public.product_modifications;

create policy "public can read product specifications"
  on public.product_specifications for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_active = true
    )
  );

create policy "public can read product modifications"
  on public.product_modifications for select
  using (
    exists (
      select 1
      from public.products p
      where p.id = product_id
        and p.is_active = true
    )
  );

create policy "authenticated can manage product specifications"
  on public.product_specifications for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage product modifications"
  on public.product_modifications for all
  to authenticated
  using (true)
  with check (true);

update public.site_settings
set value = value
  || '{
    "generalInfo": "Общие сведения",
    "productType": "Тип",
    "packingNorm": "Норма упаковки",
    "applicationArea": "Область применения",
    "specifications": "Технические характеристики",
    "modifications": "Модификации",
    "sketch": "Эскиз изделия",
    "specificationName": "Параметр",
    "specificationValue": "Значение",
    "modificationDesignation": "Обозначение",
    "modificationFeatures": "Отличительные особенности",
    "modificationApplicability": "Применяемость"
  }'::jsonb,
    updated_at = now()
where key = 'product_labels';

update public.site_settings
set value = value
  || '{
    "description": "Описание",
    "productType": "Тип",
    "packingNorm": "Норма упаковки",
    "applicationArea": "Область применения",
    "specifications": "Технические характеристики",
    "modifications": "Модификации",
    "sketch": "Эскиз изделия",
    "sketchAlt": "Описание эскиза",
    "addRow": "Добавить строку",
    "removeRow": "Удалить",
    "specificationName": "Параметр",
    "specificationValue": "Значение",
    "modificationDesignation": "Обозначение",
    "modificationFeatures": "Отличительные особенности",
    "modificationApplicability": "Применяемость"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

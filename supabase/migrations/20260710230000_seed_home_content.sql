-- Idempotent seed for home page sections and demo catalog data.
-- Run in Supabase SQL Editor if the public site stays on skeleton loaders.

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'hero', 0, '{
  "eyebrow": "Интернет-магазин",
  "title": "Automir",
  "description": "Качественные товары с быстрой доставкой по всей стране",
  "actions": [
    { "label": "Каталог", "href": "catalog", "variant": "primary" }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'hero'
      and ps.sort_order = 0
  );

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'feature_grid', 1, '{
  "title": "Почему мы",
  "description": "Все преимущества магазина управляются из админки",
  "items": [
    {
      "title": "Быстрая доставка",
      "description": "Отправляем заказы в день оформления"
    },
    {
      "title": "Гарантия качества",
      "description": "Только проверенные товары и поставщики"
    },
    {
      "title": "Поддержка 24/7",
      "description": "Поможем с выбором и оформлением заказа"
    }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'feature_grid'
      and ps.sort_order = 1
  );

insert into public.categories (
  slug,
  name,
  description,
  sort_order,
  is_active
)
values (
  'default',
  'Каталог',
  'Основная категория',
  0,
  true
)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

insert into public.products (
  slug,
  category_id,
  name,
  short_description,
  description,
  price,
  currency,
  sku,
  stock_quantity,
  is_active,
  is_featured
)
select
  'demo-product',
  c.id,
  'Демо товар',
  'Пример товара для проверки каталога',
  'Полное описание демо-товара. Замените его через админку.',
  1990,
  'RUB',
  'DEMO-001',
  10,
  true,
  true
from public.categories c
where c.slug = 'default'
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    short_description = excluded.short_description,
    description = excluded.description,
    price = excluded.price,
    currency = excluded.currency,
    sku = excluded.sku,
    stock_quantity = excluded.stock_quantity,
    is_active = excluded.is_active,
    is_featured = excluded.is_featured,
    updated_at = now();

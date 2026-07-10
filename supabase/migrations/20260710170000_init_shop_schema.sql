create extension if not exists pgcrypto;

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-images',
  'site-images',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'site-images',
  path text not null unique,
  public_url text not null,
  alt text not null,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes > 0),
  created_at timestamptz not null default now()
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  sort_order integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_asset_id uuid references public.media_assets(id) on delete set null,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  short_description text,
  description text,
  price numeric not null check (price >= 0),
  old_price numeric check (old_price >= 0),
  currency text not null,
  sku text not null unique,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  asset_id uuid references public.media_assets(id) on delete set null,
  url text not null,
  alt text not null,
  sort_order integer not null default 0
);

create table public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  sort_order integer not null default 0
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text,
  total_amount numeric not null check (total_amount >= 0),
  currency text not null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  product_sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  total_price numeric not null check (total_price >= 0)
);

create index idx_page_sections_page_order on public.page_sections(page_id, sort_order);
create index idx_media_assets_bucket_path on public.media_assets(bucket_id, path);
create index idx_categories_parent_order on public.categories(parent_id, sort_order);
create index idx_products_category_active on public.products(category_id, is_active);
create index idx_products_featured_active on public.products(is_featured, is_active);
create index idx_product_images_product_order on public.product_images(product_id, sort_order);
create index idx_product_attributes_product_order on public.product_attributes(product_id, sort_order);
create index idx_order_items_order on public.order_items(order_id);

alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.media_assets enable row level security;
alter table public.page_sections enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_attributes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public can read site settings"
  on public.site_settings for select
  using (true);

create policy "public can read published pages"
  on public.pages for select
  using (is_published = true);

create policy "public can read media assets"
  on public.media_assets for select
  using (true);

create policy "public can read site image objects"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "public can read active page sections"
  on public.page_sections for select
  using (is_active = true);

create policy "public can read active categories"
  on public.categories for select
  using (is_active = true);

create policy "public can read active products"
  on public.products for select
  using (is_active = true);

create policy "public can read product images"
  on public.product_images for select
  using (true);

create policy "public can read product attributes"
  on public.product_attributes for select
  using (true);

create policy "public can create orders"
  on public.orders for insert
  with check (status = 'new');

create policy "public can create order items"
  on public.order_items for insert
  with check (true);

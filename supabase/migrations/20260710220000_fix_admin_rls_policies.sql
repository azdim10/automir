-- Idempotent fix: allow authenticated users to manage admin tables.
-- Run in Supabase SQL Editor if admin save returns 42501 / RLS errors.

drop policy if exists "authenticated can manage site settings" on public.site_settings;
drop policy if exists "authenticated can manage categories" on public.categories;
drop policy if exists "authenticated can manage products" on public.products;
drop policy if exists "authenticated can manage product images" on public.product_images;
drop policy if exists "authenticated can manage product attributes" on public.product_attributes;
drop policy if exists "authenticated can manage media assets" on public.media_assets;
drop policy if exists "authenticated can read orders" on public.orders;
drop policy if exists "authenticated can update orders" on public.orders;
drop policy if exists "authenticated can read order items" on public.order_items;

create policy "authenticated can manage site settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage product images"
  on public.product_images for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage product attributes"
  on public.product_attributes for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage media assets"
  on public.media_assets for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can read orders"
  on public.orders for select
  to authenticated
  using (true);

create policy "authenticated can update orders"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can read order items"
  on public.order_items for select
  to authenticated
  using (true);

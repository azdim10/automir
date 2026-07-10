create policy "authenticated can manage categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage site settings"
  on public.site_settings for all
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

create policy "authenticated can create site image objects"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

create policy "authenticated can update site image objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

create policy "authenticated can delete site image objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');

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

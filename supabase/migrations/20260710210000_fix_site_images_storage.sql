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
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/x-icon'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read site image objects" on storage.objects;
drop policy if exists "authenticated can create site image objects" on storage.objects;
drop policy if exists "authenticated can update site image objects" on storage.objects;
drop policy if exists "authenticated can delete site image objects" on storage.objects;

create policy "public can read site image objects"
  on storage.objects for select
  using (bucket_id = 'site-images');

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

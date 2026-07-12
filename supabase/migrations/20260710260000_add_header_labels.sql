insert into public.site_settings (key, value)
values ('header_labels', '{"catalog":"Каталог"}'::jsonb)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

update public.page_sections
set payload = jsonb_set(
  payload,
  '{actions}',
  '[
    { "label": "Каталог", "href": "catalog", "variant": "primary" }
  ]'::jsonb
)
where type = 'hero'
  and page_id in (select id from public.pages where slug = 'home');

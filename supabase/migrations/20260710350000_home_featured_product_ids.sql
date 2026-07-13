update public.site_settings
set value = value
  - 'featuredLimit'
  || '{
    "featuredProducts": "Товары на главной"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

update public.site_settings
set value = jsonb_set(
  value,
  '{empty}',
  '"Выберите товары для главной в админке: Страницы → Главная"'::jsonb,
  true
),
updated_at = now()
where key = 'home_labels';

update public.page_sections
set payload = (payload - 'limit') || '{"productIds": []}'::jsonb
where page_id in (select id from public.pages where slug = 'home')
  and type = 'featured_products'
  and sort_order = 1
  and not (payload ? 'productIds');

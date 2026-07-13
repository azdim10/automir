update public.site_settings
set value = value
  || '{
    "addedToCart": "Добавлено в корзину"
  }'::jsonb,
    updated_at = now()
where key = 'product_labels';

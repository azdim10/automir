update public.site_settings
set value = value
  || '{
    "search": "Поиск",
    "searchPlaceholder": "Название или артикул"
  }'::jsonb,
    updated_at = now()
where key = 'header_labels';

update public.site_settings
set value = value
  || '{
    "overview": "Главная",
    "settings": "Настройки сайта"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

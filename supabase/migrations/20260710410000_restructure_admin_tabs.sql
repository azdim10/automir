update public.site_settings
set value = (value - 'overview')
  || '{
    "requests": "Заявки и заказы",
    "systemSettings": "Системные настройки",
    "settings": "Настройки сайта"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

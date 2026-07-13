update public.site_settings
set value = value || '{"edit": "Редактировать"}'::jsonb,
    updated_at = now()
where key = 'admin_labels';

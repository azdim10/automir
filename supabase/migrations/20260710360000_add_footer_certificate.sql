update public.site_settings
set value = value
  || '{
    "certificate": "Сертификат"
  }'::jsonb,
    updated_at = now()
where key = 'footer_labels';

update public.site_settings
set value = value
  || '{
    "certificateUrl": "",
    "certificateAlt": "Сертификат"
  }'::jsonb,
    updated_at = now()
where key = 'footer_settings';

update public.site_settings
set value = value
  || '{
    "footerCertificate": "Сертификат",
    "footerCertificateAlt": "Описание сертификата"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

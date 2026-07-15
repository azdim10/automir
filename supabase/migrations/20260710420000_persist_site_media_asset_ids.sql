update public.site_settings
set value = value || '{"logoAssetId": null}'::jsonb,
    updated_at = now()
where key = 'site_profile'
  and not (value ? 'logoAssetId');

update public.site_settings
set value = value
  || '{
    "backgroundAssetId": null,
    "certificateAssetId": null
  }'::jsonb,
    updated_at = now()
where key = 'footer_settings'
  and not (value ? 'certificateAssetId');

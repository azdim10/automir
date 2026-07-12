-- Currency is fixed to RUB in the app. Clean up legacy settings.

delete from public.site_settings
where key = 'currency';

update public.site_settings
set value = value - 'currency',
    updated_at = now()
where key = 'admin_labels'
  and value ? 'currency';

update public.products
set currency = 'RUB'
where currency is distinct from 'RUB';

update public.orders
set currency = 'RUB'
where currency is distinct from 'RUB';

-- Fix invalid product currency values like "Рубли" -> ISO code "RUB".

update public.products
set currency = 'RUB'
where lower(trim(currency)) in ('рубли', 'рубль', 'руб', 'rub', 'ruble', 'rubles')
   or currency !~ '^[A-Za-z]{3}$';

update public.site_settings
set value = '"RUB"'::jsonb,
    updated_at = now()
where key = 'currency'
  and value #>> '{}' not similar to '[A-Za-z]{3}';

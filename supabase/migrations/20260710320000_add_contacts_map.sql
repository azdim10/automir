update public.site_settings
set value = value
  || '{
    "contactsPage": "Контакты",
    "mapTitle": "Схема проезда",
    "mapLatitude": "Широта",
    "mapLongitude": "Долгота",
    "mapZoom": "Масштаб карты"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'content', 0, '{
  "title": "Контакты",
  "description": "Свяжитесь с нами по телефону, email или приезжайте в наш офис. Мы ответим на вопросы по ассортименту, доставке и оформлению заказа.",
  "map": {
    "title": "Схема проезда",
    "latitude": 56.086446,
    "longitude": 63.634929,
    "zoom": 16
  }
}'::jsonb, true
from public.pages p
where p.slug = 'contacts'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'content'
      and ps.sort_order = 0
  );

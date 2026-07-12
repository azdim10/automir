insert into public.site_settings (key, value)
values
  (
    'header_labels',
    '{
      "home": "Главная",
      "catalog": "Каталог",
      "contacts": "Контакты",
      "news": "Новости",
      "requestCall": "Заказать звонок"
    }'::jsonb
  ),
  (
    'categories_labels',
    '{
      "title": "Каталог",
      "description": "Выберите категорию товаров",
      "empty": "Категории пока не добавлены"
    }'::jsonb
  ),
  (
    'contacts_labels',
    '{
      "title": "Контакты",
      "phone": "Телефон",
      "email": "Email",
      "address": "Адрес",
      "socialLinks": "Мы в соцсетях",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "max": "Max",
      "vk": "VK",
      "empty": "Контактная информация пока не заполнена"
    }'::jsonb
  ),
  (
    'news_labels',
    '{
      "empty": "Новостей пока нет",
      "loadError": "Не удалось загрузить новости",
      "loadErrorDescription": "Проверьте подключение к Supabase и наличие страницы news"
    }'::jsonb
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

insert into public.pages (
  slug,
  title,
  meta_title,
  meta_description,
  is_published
)
values
  ('contacts', 'Контакты', 'Контакты', 'Контакты магазина', true),
  ('news', 'Новости', 'Новости', 'Новости магазина', true)
on conflict (slug) do update
set title = excluded.title,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    is_published = excluded.is_published,
    updated_at = now();

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'feature_grid', 0, '{
  "title": "Последние новости",
  "items": [
    {
      "title": "Открытие обновленного каталога",
      "description": "Мы запустили новый каталог с удобным выбором категорий."
    },
    {
      "title": "Расширили ассортимент",
      "description": "Добавили новые товары и обновили цены."
    }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'news'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'feature_grid'
      and ps.sort_order = 0
  );

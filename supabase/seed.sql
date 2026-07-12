insert into public.site_settings (key, value)
values
  ('locale', '"ru-RU"'::jsonb),
  (
    'admin_labels',
    '{
      "active": "Активно",
      "addCategory": "Категория",
      "addProduct": "Товар",
      "adminTitle": "Админ-панель",
      "category": "Категория",
      "categories": "Категории",
      "delete": "Удалить",
      "email": "Email",
      "image": "Изображение",
      "imageAlt": "Описание изображения",
      "inactive": "Неактивно",
      "login": "Войти",
      "logo": "Логотип",
      "logoAlt": "Описание логотипа",
      "logout": "Выйти",
      "max": "Max",
      "name": "Название",
      "orders": "Заказы",
      "password": "Пароль",
      "price": "Цена",
      "products": "Товары",
      "save": "Сохранить",
      "seoDescription": "SEO описание",
      "seoKeywords": "SEO ключевые слова",
      "seoTitle": "SEO заголовок",
      "settings": "Настройки",
      "sku": "Артикул",
      "slug": "Slug",
      "socialLinks": "Социальные сети",
      "status": "Статус",
      "stock": "Остаток",
      "storeAddress": "Адрес",
      "storeName": "Название магазина",
      "storePhone": "Телефон",
      "telegram": "Telegram",
      "vk": "VK",
      "whatsapp": "WhatsApp"
    }'::jsonb
  ),
  (
    'site_profile',
    '{
      "storeName": "Automir",
      "phone": "",
      "email": "",
      "address": "",
      "logoUrl": "",
      "logoAlt": ""
    }'::jsonb
  ),
  (
    'social_links',
    '{
      "telegram": "",
      "whatsapp": "",
      "max": "",
      "vk": ""
    }'::jsonb
  ),
  (
    'seo_settings',
    '{
      "title": "Automir",
      "description": "",
      "keywords": ""
    }'::jsonb
  ),
  (
    'cart_labels',
    '{
      "title": "Корзина",
      "items": "Товары",
      "total": "Итого",
      "price": "Цена",
      "quantity": "Количество",
      "itemTotal": "Сумма",
      "increment": "Увеличить",
      "decrement": "Уменьшить",
      "remove": "Удалить",
      "empty": "Корзина пуста",
      "checkout": "Оформить заказ"
    }'::jsonb
  ),
  (
    'checkout_labels',
    '{
      "title": "Оформление заказа",
      "name": "Имя",
      "phone": "Телефон",
      "email": "Email",
      "deliveryAddress": "Адрес доставки",
      "submit": "Оформить заказ",
      "summary": "Ваш заказ",
      "total": "Итого",
      "empty": "Корзина пуста",
      "success": "Заказ успешно оформлен",
      "error": "Не удалось оформить заказ. Попробуйте еще раз",
      "orderNumber": "Номер заказа",
      "backToCart": "Вернуться в каталог"
    }'::jsonb
  ),
  ('product_labels', '{"addToCart":"Добавить в корзину","attributes":"Характеристики","description":"Описание","sku":"Артикул"}'::jsonb),
  ('header_labels', '{"catalog":"Каталог"}'::jsonb),
  ('catalog_page_size', '12'::jsonb),
  (
    'catalog_labels',
    '{
      "search": "Поиск",
      "searchPlaceholder": "Название или артикул",
      "categoryPlaceholder": "Все категории",
      "previousPage": "Назад",
      "nextPage": "Вперед",
      "page": "Страница",
      "total": "Найдено",
      "empty": "Товары не найдены"
    }'::jsonb
  ),
  (
    'catalog_sort_options',
    '[
      { "value": "created-desc", "label": "Сначала новые" },
      { "value": "price-asc", "label": "Сначала дешевле" },
      { "value": "price-desc", "label": "Сначала дороже" },
      { "value": "name-asc", "label": "По названию" }
    ]'::jsonb
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
  ('home', 'Главная', 'Главная', 'Главная страница', true),
  ('catalog', 'Каталог', 'Каталог', 'Каталог товаров', true)
on conflict (slug) do update
set title = excluded.title,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    is_published = excluded.is_published,
    updated_at = now();

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'hero', 0, '{
  "eyebrow": "Интернет-магазин",
  "title": "Automir",
  "description": "Качественные товары с быстрой доставкой по всей стране",
  "actions": [
    { "label": "Каталог", "href": "catalog", "variant": "primary" }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'hero'
      and ps.sort_order = 0
  );

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'feature_grid', 1, '{
  "title": "Почему мы",
  "description": "Все преимущества магазина управляются из админки",
  "items": [
    {
      "title": "Быстрая доставка",
      "description": "Отправляем заказы в день оформления"
    },
    {
      "title": "Гарантия качества",
      "description": "Только проверенные товары и поставщики"
    },
    {
      "title": "Поддержка 24/7",
      "description": "Поможем с выбором и оформлением заказа"
    }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'feature_grid'
      and ps.sort_order = 1
  );

insert into public.categories (
  slug,
  name,
  description,
  sort_order,
  is_active
)
values (
  'default',
  'Каталог',
  'Основная категория',
  0,
  true
)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active;

insert into public.products (
  slug,
  category_id,
  name,
  short_description,
  description,
  price,
  currency,
  sku,
  stock_quantity,
  is_active,
  is_featured
)
select
  'demo-product',
  c.id,
  'Демо товар',
  'Пример товара для проверки каталога',
  'Полное описание демо-товара. Замените его через админку.',
  1990,
  'RUB',
  'DEMO-001',
  10,
  true,
  true
from public.categories c
where c.slug = 'default'
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    short_description = excluded.short_description,
    description = excluded.description,
    price = excluded.price,
    currency = excluded.currency,
    sku = excluded.sku,
    stock_quantity = excluded.stock_quantity,
    is_active = excluded.is_active,
    is_featured = excluded.is_featured,
    updated_at = now();

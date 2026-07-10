insert into public.site_settings (key, value)
values
  ('locale', '"ru-RU"'::jsonb),
  ('currency', '"RUB"'::jsonb),
  (
    'admin_labels',
    '{
      "active": "Активно",
      "addCategory": "Категория",
      "addProduct": "Товар",
      "adminTitle": "Админ-панель",
      "category": "Категория",
      "categories": "Категории",
      "currency": "Валюта",
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

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
      "callbacks": "Заявки на звонок",
      "category": "Категория",
      "categories": "Категории",
      "delete": "Удалить",
      "email": "Email",
      "image": "Изображение",
      "imageAlt": "Описание изображения",
      "inactive": "Неактивно",
      "login": "Войти",
      "logo": "Логотип в шапке",
      "logoAlt": "Описание логотипа",
      "logout": "Выйти",
      "max": "Max",
      "name": "Название",
      "orders": "Заказы",
      "pages": "Страницы",
      "pageTitle": "Заголовок страницы",
      "pageMetaTitle": "SEO заголовок",
      "pageMetaDescription": "SEO описание",
      "sectionText": "Основной текст",
      "pageImage": "Изображение",
      "pageImageAlt": "Описание изображения",
      "deliveryPage": "Доставка",
      "warrantyPage": "Гарантия",
      "aboutPage": "О компании",
      "contactsPage": "Контакты",
      "mapTitle": "Схема проезда",
      "mapLatitude": "Широта",
      "mapLongitude": "Долгота",
      "mapZoom": "Масштаб карты",
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
      "whatsapp": "WhatsApp",
      "description": "Описание",
      "productType": "Тип",
      "packingNorm": "Норма упаковки",
      "applicationArea": "Область применения",
      "specifications": "Технические характеристики",
      "modifications": "Модификации",
      "sketch": "Эскиз изделия",
      "sketchAlt": "Описание эскиза",
      "addRow": "Добавить строку",
      "removeRow": "Удалить",
      "specificationName": "Параметр",
      "specificationValue": "Значение",
      "modificationDesignation": "Обозначение",
      "modificationFeatures": "Отличительные особенности",
      "modificationApplicability": "Применяемость",
      "footer": "Футер",
      "footerCopyright": "Копирайт",
      "footerCompanyName": "Название компании",
      "footerAddress": "Адрес в футере",
      "footerEmails": "Email (по одному в строке)",
      "footerPhones": "Телефоны (по одному в строке)",
      "footerBackground": "Фон футера"
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
  ('product_labels', '{
    "addToCart": "Добавить в корзину",
    "attributes": "Характеристики",
    "description": "Описание",
    "sku": "Артикул",
    "generalInfo": "Общие сведения",
    "productType": "Тип",
    "packingNorm": "Норма упаковки",
    "applicationArea": "Область применения",
    "specifications": "Технические характеристики",
    "modifications": "Модификации",
    "sketch": "Эскиз изделия",
    "specificationName": "Параметр",
    "specificationValue": "Значение",
    "modificationDesignation": "Обозначение",
    "modificationFeatures": "Отличительные особенности",
    "modificationApplicability": "Применяемость"
  }'::jsonb),
  ('header_labels', '{
    "home": "Главная",
    "catalog": "Каталог",
    "delivery": "Доставка",
    "warranty": "Гарантия",
    "about": "О компании",
    "contacts": "Контакты",
    "news": "Новости",
    "requestCall": "Заказать звонок"
  }'::jsonb),
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
    'footer_labels',
    '{
      "address": "Адрес:",
      "email": "E-mail:",
      "phoneFax": "тел/факс:"
    }'::jsonb
  ),
  (
    'footer_settings',
    '{
      "copyright": "© 2014. avtomir45.ru.",
      "companyName": "ООО \"Компания Автомир\".",
      "address": "641882, Курганская область, г. Шадринск, ул. Розы Люксембург, 26",
      "emails": [
        "avtomir.shaaz@yandex.ru",
        "avtomir.2011@mail.ru"
      ],
      "phones": [
        "+7 (35253) 7-47-16",
        "8-912-833-22-90"
      ],
      "backgroundUrl": "",
      "backgroundAlt": "Фон футера"
    }'::jsonb
  ),
  (
    'callback_labels',
    '{
      "title": "Заказать звонок",
      "description": "Оставьте контакты и мы перезвоним вам",
      "name": "Имя",
      "phone": "Телефон",
      "submit": "Отправить",
      "success": "Заявка отправлена. Мы скоро свяжемся с вами",
      "error": "Не удалось отправить заявку. Попробуйте еще раз",
      "close": "Закрыть",
      "requestCall": "Заказать звонок"
    }'::jsonb
  ),
  (
    'news_labels',
    '{
      "empty": "Новостей пока нет",
      "loadError": "Не удалось загрузить новости",
      "loadErrorDescription": "Проверьте подключение к Supabase и наличие страницы news"
    }'::jsonb
  ),
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
  ('catalog', 'Каталог', 'Каталог', 'Каталог товаров', true),
  ('contacts', 'Контакты', 'Контакты', 'Контакты магазина', true),
  ('news', 'Новости', 'Новости', 'Новости магазина', true),
  ('delivery', 'Доставка', 'Доставка', 'Условия доставки товаров', true),
  ('warranty', 'Гарантия', 'Гарантия', 'Гарантийные условия', true),
  ('about', 'О компании', 'О компании', 'Информация о компании', true)
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

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'content', 0, '{
  "title": "Доставка",
  "description": "Мы доставляем заказы по городу и в регионы. Сроки и стоимость зависят от адреса и состава заказа. Менеджер свяжется с вами после оформления для подтверждения деталей."
}'::jsonb, true
from public.pages p
where p.slug = 'delivery'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'content'
      and ps.sort_order = 0
  );

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'content', 0, '{
  "title": "Гарантия",
  "description": "На все товары действует гарантия производителя. При обнаружении заводского брака обратитесь в сервисный центр или к нам — поможем с оформлением гарантийного случая."
}'::jsonb, true
from public.pages p
where p.slug = 'warranty'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'content'
      and ps.sort_order = 0
  );

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'content', 0, '{
  "title": "О компании",
  "description": "Automir — интернет-магазин автотоваров. Мы подбираем качественные позиции, помогаем с выбором и обеспечиваем удобную доставку."
}'::jsonb, true
from public.pages p
where p.slug = 'about'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'content'
      and ps.sort_order = 0
  );

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

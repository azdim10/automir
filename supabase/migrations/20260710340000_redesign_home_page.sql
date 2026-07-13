update public.page_sections
set is_active = false
where page_id in (select id from public.pages where slug = 'home')
  and type in ('hero', 'feature_grid');

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'welcome', 0, '{
  "title": "ДОБРО ПОЖАЛОВАТЬ НА САЙТ ООО \"КОМПАНИЯ АВТОМИР\"",
  "descriptionLeft": "Уважаемые посетители! Мы рады приветствовать Вас на сайте ООО «Компания Автомир». Наша компания имеет большой опыт работы на рынке запасных частей. Мы предлагаем гибкую систему скидок и короткие сроки поставки товаров.",
  "descriptionRight": "Наша цель — долгосрочное и взаимовыгодное сотрудничество с каждым клиентом. Склад в г. Шадринск. Отправка товаров: ПЭК, Деловые линии, GTD, Автотрейдинг, KIT, «Скиф-Карго», 1001 вагон, «Деловые грузы-Курган».",
  "actions": [
    {
      "label": "перейти в каталог",
      "href": "/catalog",
      "variant": "primary"
    }
  ]
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'welcome'
      and ps.sort_order = 0
      and ps.is_active = true
  );

insert into public.page_sections (page_id, type, sort_order, payload, is_active)
select p.id, 'featured_products', 1, '{
  "detailsLabel": "Подробнее >>",
  "limit": 6
}'::jsonb, true
from public.pages p
where p.slug = 'home'
  and not exists (
    select 1
    from public.page_sections ps
    where ps.page_id = p.id
      and ps.type = 'featured_products'
      and ps.sort_order = 1
      and ps.is_active = true
  );

insert into public.site_settings (key, value)
values
  (
    'home_labels',
    '{
      "empty": "Рекомендуемые товары пока не добавлены"
    }'::jsonb
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

update public.site_settings
set value = value
  || '{
    "homePage": "Главная",
    "descriptionLeft": "Текст слева",
    "descriptionRight": "Текст справа",
    "catalogAction": "Кнопка каталога",
    "featuredTitle": "Заголовок блока товаров",
    "featuredDetailsLabel": "Текст ссылки на товар",
    "featuredLimit": "Количество товаров"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

update public.pages
set title = 'Главная',
    meta_title = 'Главная',
    meta_description = 'ООО Компания Автомир — запасные части и автотовары',
    updated_at = now()
where slug = 'home';

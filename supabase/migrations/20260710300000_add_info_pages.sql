drop policy if exists "authenticated can manage pages" on public.pages;
drop policy if exists "authenticated can manage page sections" on public.page_sections;

create policy "authenticated can manage pages"
  on public.pages for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can manage page sections"
  on public.page_sections for all
  to authenticated
  using (true)
  with check (true);

update public.site_settings
set value = value
  || '{
    "delivery": "Доставка",
    "warranty": "Гарантия",
    "about": "О компании"
  }'::jsonb,
    updated_at = now()
where key = 'header_labels';

update public.site_settings
set value = value
  || '{
    "pages": "Страницы",
    "pageTitle": "Заголовок страницы",
    "pageMetaTitle": "SEO заголовок",
    "pageMetaDescription": "SEO описание",
    "sectionText": "Основной текст",
    "pageImage": "Изображение",
    "pageImageAlt": "Описание изображения",
    "deliveryPage": "Доставка",
    "warrantyPage": "Гарантия",
    "aboutPage": "О компании"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

insert into public.pages (
  slug,
  title,
  meta_title,
  meta_description,
  is_published
)
values
  (
    'delivery',
    'Доставка',
    'Доставка',
    'Условия доставки товаров',
    true
  ),
  (
    'warranty',
    'Гарантия',
    'Гарантия',
    'Гарантийные условия',
    true
  ),
  (
    'about',
    'О компании',
    'О компании',
    'Информация о компании',
    true
  )
on conflict (slug) do update
set title = excluded.title,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    is_published = excluded.is_published,
    updated_at = now();

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

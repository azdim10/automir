insert into public.site_settings (key, value)
values
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
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

update public.site_settings
set value = value
  || '{
    "footer": "Футер",
    "footerCopyright": "Копирайт",
    "footerCompanyName": "Название компании",
    "footerAddress": "Адрес в футере",
    "footerEmails": "Email (по одному в строке)",
    "footerPhones": "Телефоны (по одному в строке)",
    "footerBackground": "Фон футера"
  }'::jsonb,
    updated_at = now()
where key = 'admin_labels';

# Automir

Инфраструктура интернет-магазина на React, Vite, TypeScript, Tailwind CSS и Supabase.

## Команды

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
```

## Env

Скопируйте `.env.example` в `.env.local` и заполните значения Supabase.

## GitHub Pages

Для автоматического деплоя добавьте в GitHub repository secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

По умолчанию GitHub Actions собирает проект с base path `/<repo-name>/`.
Если используется custom domain или user/organization Pages, добавьте repository variable:

```text
VITE_BASE_PATH=/
```

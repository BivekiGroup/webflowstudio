# WebFlow Studio

Маркетинговый лендинг и прототип панели управления для WebFlow Studio. Проект использует Next.js App Router, кастомные shadcn/ui-компоненты и Prisma для работы с PostgreSQL.

## Требования

- Node.js 18+ (рекомендуется 20 LTS)
- PostgreSQL 14+ с доступной базой данных
- npm (или другой совместимый пакетный менеджер)

## Быстрый старт

1. Скопируйте файл окружения и пропишите параметры подключения к базе:
   ```bash
   cp .env.example .env
   # DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Примените Prisma-модель и сгенерируйте клиент:
   ```bash
   npx prisma migrate dev --name init-auth
   # или, если миграции применять нельзя, выполните
   npx prisma db push
   npx prisma generate
   ```
4. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
5. Откройте [http://localhost:3000](http://localhost:3000) чтобы увидеть сайт.

## Реализованные фичи авторизации

- Регистрация с проверкой пароля (минимум 8 символов) и автоматическим созданием сессии.
- Авторизация по email/паролю с хешированием `bcryptjs`.
- Серверные сессии на Prisma (`User` ↔ `Session`) и http-only cookie с автоудалением по истечению срока.
- Страницы `/login`, `/register` и защищённый `/dashboard` с выходом.
- Динамическая навигация на главной: кнопки входа/регистрации или приветствие с переходом в панель.

## Структура

- `prisma/schema.prisma` — схема БД (таблицы `User`, `Session`).
- `src/lib/prisma.ts` — singleton-клиент Prisma.
- `src/lib/auth.ts` — серверные хелперы: hash/verify, управление сессиями, `getCurrentUser`.
- `src/app/(auth)` — формы входа/регистрации, серверные экшены и общий UI-компонент формы.
- `src/app/dashboard` — защищённая панель.

## Дальнейшие шаги

- Добавить валидацию на основе `zod` и полноценные сообщения об ошибках форм.
- Подключить отправку писем (reset password / verify email).
- Интегрировать OAuth/SSO, если понадобится внешняя авторизация.

# webflowstudio

# WebFlow Studio - Презентация Бета-версии

**Версия:** 0.1.0 (Beta)
**Дата:** Октябрь 2025
**Компания:** [Biveki](https://biveki.ru)

---

## Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Ключевые возможности](#ключевые-возможности)
3. [Технический стек](#технический-стек)
4. [Реализованные функции](#реализованные-функции)
5. [Архитектура системы](#архитектура-системы)
6. [Что дальше](#что-дальше)

---

## Обзор проекта

**WebFlow Studio** — это визуальный конструктор сайтов нового поколения, объединяющий:

- **Визуальный редактор** (как Tilda) — drag & drop интерфейс для создания страниц
- **Автоматизация workflow** (как n8n) — гибкая система подключения данных
- **Экспорт кода** — пользователи получают чистый код для самостоятельного деплоя
- **Без хостинга** — платформа не предоставляет хостинг, только инструмент разработки

### Целевая аудитория

- Веб-разработчики, которым нужна визуализация
- Дизайнеры, желающие создавать прототипы с реальными данными
- Продуктовые команды для быстрого MVP
- Стартапы, которым нужен контроль над кодом

![Landing Page](docs/screenshots/01-landing-page.png)
*Главная страница WebFlow Studio*

---

## Ключевые возможности

### 1. Визуальный Studio Workspace

Полнофункциональный визуальный редактор с:

- **Drag & Drop** для изменения порядка блоков
- **Библиотека блоков** с превью
- **Инспектор свойств** для настройки каждого блока
- **Автосохранение** с дебаунсингом
- **Реалтайм превью** изменений

![Studio Workspace](docs/screenshots/07-studio-with-blocks.png)
*Studio Workspace с несколькими блоками на canvas*

![Blocks Library](docs/screenshots/08-blocks-library.png)
*Библиотека блоков с превью и описаниями*

### 2. Система блоков

5 готовых типов блоков:

- **Hero** — заголовок с бейджем, описанием и CTA кнопками
- **Stats** — 3 карточки с метриками (для дашбордов)
- **Workflow** — табы с описанием этапов процесса
- **CTA** — призыв к действию с кнопками
- **Form** — форма с полями email и комментария

Каждый блок:
- Полностью кастомизируется через инспектор
- Поддерживает data binding
- Имеет дефолтные пропсы
- Экспортируется в код

![Inspector Panel](docs/screenshots/09-inspector-panel.png)
*Инспектор для настройки свойств блока*

### 3. Управление данными

**Data Sources** с поддержкой:

- **REST API** — подключение к внешним API
- **GraphQL** — запросы к GraphQL эндпоинтам
- **MOCK** — встроенные тестовые данные

**Data Samples** — множественные примеры ответов для каждого источника

**Data Binding** — привязка данных к блокам:
- Выбор источника данных
- Выбор примера данных (sample)
- Маппинг полей через field mapping editor
- Автоматическое применение данных к пропсам блока

![Data Sources](docs/screenshots/10-data-sources.png)
*Панель управления источниками данных*

![Data Binding](docs/screenshots/12-data-binding.png)
*Привязка данных к блоку через Inspector*

![Field Mapping](docs/screenshots/13-field-mapping.png)
*Редактор маппинга полей данных*

### 4. Экспорт кода

Генерация готового кода в трех форматах:

#### HTML (Static)
- `index.html` с семантической разметкой
- `styles.css` с Tailwind utilities
- `script.js` с базовыми интерактивностями
- `README.md` с инструкциями

#### React
- Компоненты для каждого блока
- shadcn/ui компоненты
- `package.json` с зависимостями
- TypeScript конфигурация
- Готовая структура проекта

#### Next.js
- App Router структура
- Server Components по умолчанию
- Tailwind CSS 4
- shadcn/ui компоненты
- Полная конфигурация проекта

### 5. Аутентификация и управление проектами

**Custom Authentication:**
- Регистрация и вход пользователей
- bcrypt хеширование паролей
- Session-based auth (30-дневные сессии)
- HTTP-only cookies для безопасности

**Управление проектами:**
- Создание/редактирование/удаление проектов
- Уникальные slug для каждого проекта
- Статусы: In Progress, Demo, Preparation
- Метрики проектов

### 6. Sharing и Embed

- **Public Sharing** — публичные ссылки на проекты `/share/[slug]`
- **Embed Mode** — встраивание в iframe `/embed/[slug]`
- Preview mode для просмотра финального результата

---

## Технический стек

### Frontend
- **Next.js 15** — App Router, Turbopack, Server Components
- **React 19** — с новыми features
- **TypeScript 5** — полная типизация
- **Tailwind CSS 4** — современный стайлинг
- **shadcn/ui** — компонентная библиотека
- **@dnd-kit** — drag & drop функциональность
- **Lucide Icons** — иконки

### Backend
- **Next.js Server Actions** — вместо REST API
- **Prisma ORM 5** — типобезопасный ORM
- **PostgreSQL** — основная база данных
- **bcryptjs** — хеширование паролей

### Tools
- **ESLint** — линтинг кода
- **Prettier** (опционально) — форматирование
- **jszip** — экспорт проектов в ZIP

---

## Реализованные функции

### Аутентификация (Auth)
- ✅ Регистрация пользователей (`/register`)
- ✅ Вход в систему (`/login`)
- ✅ Управление сессиями (30 дней)
- ✅ Protected routes с редиректами
- ✅ getCurrentUser() helper
- ✅ Logout функционал

### Dashboard
- ✅ Список всех проектов пользователя
- ✅ Карточки проектов с превью
- ✅ Фильтрация по статусам
- ✅ Создание нового проекта (модальное окно)
- ✅ Навигация в Studio workspace

### Studio Workspace (Основной редактор)
- ✅ Canvas с блоками
- ✅ Drag & Drop для reordering блоков
- ✅ Sheet UI для библиотеки блоков (слева)
- ✅ Sheet UI для Data Sources (слева)
- ✅ Sheet UI для Inspector (справа)
- ✅ Автосохранение canvas state
- ✅ Выбор блока открывает Inspector
- ✅ Удаление блоков
- ✅ Добавление заметок к блокам
- ✅ Responsive preview

### Система блоков
- ✅ Hero Block — с бейджем, заголовком, CTA
- ✅ Stats Block — 3 карточки метрик
- ✅ Workflow Block — табы с этапами
- ✅ CTA Block — призыв к действию
- ✅ Form Block — форма обратной связи
- ✅ Props редакторы для каждого блока
- ✅ Дефолтные значения пропсов
- ✅ Type-safe конфигурация блоков

### Data Sources
- ✅ CRUD операции для источников данных
- ✅ Поддержка REST/GraphQL/MOCK типов
- ✅ Управление Data Samples (множественные примеры)
- ✅ Headers и config для каждого источника
- ✅ UI для создания/редактирования sources
- ✅ Привязка к проектам

### Data Binding
- ✅ Привязка блоков к источникам данных
- ✅ Выбор sample для тестирования
- ✅ Field Mapping Editor
- ✅ Автоматическое применение данных к блокам
- ✅ Real-time API fetch (REST)
- ✅ Live preview с реальными данными

### Экспорт кода
- ✅ Экспорт в HTML (static)
- ✅ Экспорт в React (с TypeScript)
- ✅ Экспорт в Next.js (App Router)
- ✅ Генерация всех необходимых файлов:
  - package.json
  - tsconfig.json
  - tailwind.config.ts
  - postcss.config.mjs
  - README.md
  - .gitignore
- ✅ shadcn/ui компоненты (Card, Button, Badge, Tabs, etc.)
- ✅ Утилиты (cn helper)
- ✅ ZIP архив для скачивания

### Database Schema
- ✅ User модель
- ✅ Session модель (cascade delete)
- ✅ Project модель с canvasState (JSON)
- ✅ DataSource модель
- ✅ DataSample модель
- ✅ Миграции через Prisma
- ✅ Индексы для оптимизации

### UI/UX
- ✅ Темная тема (slate + emerald accent)
- ✅ Responsive дизайн
- ✅ Анимации и transitions
- ✅ Loading states
- ✅ Error handling
- ✅ Toasts/notifications (через state)
- ✅ Модальные окна (Sheet)

---

## Архитектура системы

### Directory Structure

```
webflowstudio/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── actions.ts
│   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   │   ├── [slug]/      # Studio workspace
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── preview/
│   │   │   │   │   └── export/
│   │   │   │   ├── studio-workspace.tsx
│   │   │   │   ├── block-config.tsx (missing, need to find)
│   │   │   │   ├── field-mapping-editor.tsx
│   │   │   │   └── actions.ts
│   │   │   ├── page.tsx         # Project list
│   │   │   ├── create-project-form.tsx
│   │   │   └── project-card.tsx
│   │   ├── embed/[slug]/        # Embed mode
│   │   ├── share/[slug]/        # Public sharing
│   │   ├── page.tsx             # Landing
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── auth.ts              # Session management
│   │   ├── prisma.ts            # Prisma singleton
│   │   ├── projects.ts          # Project CRUD
│   │   ├── data-sources.ts      # Data source management
│   │   ├── data-binding.ts      # Binding logic
│   │   ├── api-client.ts        # API fetch helpers
│   │   ├── code-export.ts       # Code generation
│   │   ├── sample-data.ts       # Default samples
│   │   └── utils.ts
│   └── components/ui/           # shadcn/ui components
├── prisma/
│   └── schema.prisma
├── CLAUDE.md                    # Project docs for AI
├── DEPLOYMENT.md                # Deployment guide
├── DOCKER_QUICKSTART.md         # Docker setup
└── package.json
```

### Data Flow

```
User Action → Server Action → Prisma → PostgreSQL
                    ↓
              Update State → Re-render
```

### Canvas State Structure

```typescript
{
  blocks: [
    {
      instanceId: "unique-id",
      blockId: "hero" | "stats" | "workflow" | "cta" | "form",
      props: { ... },           // Block-specific props
      notes: "...",             // Optional notes
      dataBinding: {            // Optional binding
        sourceId: "...",
        sampleId: "...",
        fieldMappings: [...]
      }
    }
  ],
  selectedInstanceId: "..."
}
```

---

## Что дальше

### Планы на следующую итерацию

#### Новые функции
- [ ] Дополнительные блоки (Gallery, Testimonials, Pricing, FAQ)
- [ ] Темная/светлая тема переключение
- [ ] Multi-page проекты (роутинг)
- [ ] Компонентная библиотека (reusable blocks)
- [ ] Version history (git-like)
- [ ] Collaborative editing (real-time)
- [ ] AI-powered suggestions

#### Улучшения UI/UX
- [ ] Onboarding flow для новых пользователей
- [ ] Keyboard shortcuts
- [ ] Undo/Redo функциональность
- [ ] Copy/paste блоков
- [ ] Bulk operations (select multiple blocks)
- [ ] Search по блокам и data sources

#### Технические улучшения
- [ ] Unit тесты (Vitest)
- [ ] E2E тесты (Playwright)
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Error tracking (Sentry)
- [ ] Rate limiting
- [ ] Database backups

#### Интеграции
- [ ] GitHub integration (auto-deploy)
- [ ] Figma import
- [ ] Notion data source
- [ ] Airtable data source
- [ ] Stripe integration (для платных планов)

---

## Метрики бета-версии

### Код
- **Общий размер кодовой базы:** ~15,000 строк кода
- **Файлов:** ~80+
- **Компонентов:** 30+
- **Server Actions:** 15+
- **Database моделей:** 5

### Функциональность
- **Блоков:** 5
- **Data Source типов:** 3 (REST, GraphQL, MOCK)
- **Экспорт форматов:** 3 (HTML, React, Next.js)
- **Страниц:** 10+ (включая динамические роуты)

---

## Демонстрация возможностей

### User Journey

1. **Регистрация** → Пользователь создает аккаунт
2. **Dashboard** → Видит список проектов (пока пустой)
3. **Создание проекта** → Заполняет форму, выбирает статус
4. **Studio Workspace** → Открывается визуальный редактор
5. **Добавление блоков** → Drag & drop из библиотеки
6. **Настройка блоков** → Изменение текстов, цветов через Inspector
7. **Создание Data Source** → Подключение к API
8. **Data Binding** → Привязка данных к блокам
9. **Preview** → Просмотр финального результата
10. **Export** → Скачивание кода в нужном формате
11. **Deploy** → Самостоятельный деплой на хостинг

---

## Технические достижения

### Performance
- Server Components для быстрой загрузки
- Turbopack для мгновенного HMR
- Debounced auto-save (не нагружает БД)
- Optimistic UI updates

### Developer Experience
- Full TypeScript покрытие
- Type-safe Prisma client
- Server Actions вместо REST API (меньше boilerplate)
- Hot reload с Turbopack
- Clear code organization

### Security
- bcrypt хеширование (10 rounds)
- HTTP-only cookies
- Session expiration (30 дней)
- Protected routes
- Input validation на сервере

---

## Отзывы и тестирование

### Beta-тестеры
- [ ] Внутренняя команда Biveki
- [ ] 5-10 внешних тестеров (друзья/коллеги)
- [ ] Feedback форма на каждой странице

### Метрики для отслеживания
- Время создания первого проекта
- Количество блоков в среднем проекте
- Использование data binding (%)
- Формат экспорта (HTML vs React vs Next.js)
- Конверсия регистрация → создание проекта

---

## Выводы

### Что получилось хорошо
- Полнофункциональный визуальный редактор
- Гибкая система data binding
- Качественный экспорт кода (3 формата)
- Удобный UX с Sheet-based UI
- Type-safe архитектура

### Что можно улучшить
- Производительность при большом количестве блоков
- Больше блоков и компонентов
- Улучшенная система темизации
- Collaborative features
- Mobile версия редактора

### Готовность к следующему этапу
Бета-версия **готова для ограниченного релиза** внутренним тестерам. Основной функционал работает, код стабилен, но требуется больше блоков и полировка UX.

---

## Контакты

**Команда:** Biveki
**Сайт:** [biveki.ru](https://biveki.ru)
**Проект:** webflowstudio.ru
**Репозиторий:** (частный на данный момент)

---

**Сгенерировано:** 20 октября 2025
**Версия документа:** 1.0

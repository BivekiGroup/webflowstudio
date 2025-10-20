# Руководство по работе с данными в WebFlow Studio

## Обзор

Теперь WebFlow Studio поддерживает **реальную работу с данными** - вы можете подключать блоки к источникам данных (REST API, GraphQL, Mock) и автоматически заполнять их содержимое.

## Как это работает

### 1. Создайте Data Source

В Studio Workspace:
1. Нажмите кнопку **"Данные"** (левая панель)
2. Создайте новый источник данных
3. Добавьте пример ответа API (Data Sample)

Пример JSON для Hero блока:
```json
{
  "badge": "API Ready",
  "title": "Данные загружены из API",
  "description": "Этот блок автоматически заполнен данными из примера API ответа",
  "primaryButton": "Начать работу",
  "secondaryButton": "Узнать больше"
}
```

### 2. Подключите блок к данным

1. Выберите блок на canvas
2. В инспекторе (правая панель) найдите секцию **"Источник данных"**
3. Выберите Data Source
4. Выберите Sample (пример ответа)
5. Блок автоматически заполнится данными!

### 3. Маппинг полей

Система автоматически применяет маппинг полей из JSON в props блока:

#### Hero / CTA блоки
```json
{
  "badge": "текст бейджа",
  "title": "заголовок",
  "description": "описание",
  "primaryButton": "текст кнопки 1",
  "secondaryButton": "текст кнопки 2"
}
```

#### Stats блок
```json
{
  "metrics": [
    {
      "label": "Название метрики",
      "value": "Значение",
      "detail": "Детали"
    }
  ]
}
```

#### Workflow блок
```json
{
  "stages": [
    {
      "id": "unique-id",
      "label": "Название этапа",
      "title": "Заголовок",
      "description": "Описание этапа",
      "tags": ["Tag1", "Tag2"]
    }
  ]
}
```

#### Form блок
```json
{
  "title": "Заголовок формы",
  "description": "Описание формы",
  "emailLabel": "Email метка",
  "commentLabel": "Комментарий метка",
  "submitLabel": "Текст кнопки"
}
```

## Работа с вложенными данными

Система поддерживает извлечение данных из вложенных объектов:

```json
{
  "success": true,
  "data": {
    "hero": {
      "badge": "v2.0",
      "title": "Вложенные данные работают",
      "description": "Данные извлечены из data.hero"
    }
  }
}
```

Используйте field path: `data.hero.title` для доступа к `"Вложенные данные работают"`

## Примеры данных

В файле `src/lib/sample-data.ts` находятся готовые примеры для всех типов блоков:

- `heroSampleData` - для Hero блока
- `statsSampleData` - для Stats блока
- `workflowSampleData` - для Workflow блока
- `ctaSampleData` - для CTA блока
- `formSampleData` - для Form блока

## Архитектура

### Основные компоненты

1. **`src/lib/data-binding.ts`** - утилиты для работы с данными:
   - `getValueByPath()` - извлечение данных по пути (например, "user.name")
   - `applyDataToBlockProps()` - применение данных к props блока
   - `defaultBlockMappings` - стандартные маппинги для каждого типа блока

2. **`src/lib/projects.ts`** - расширенный тип `CanvasDataBinding`:
   ```typescript
   export type CanvasDataBinding = {
     sourceId: string;
     sampleId: string | null;
     fieldPath?: string | null;
     fieldMappings?: Array<{
       sourcePath: string;
       targetProp: string;
     }> | null;
   };
   ```

3. **`src/app/dashboard/projects/studio-preview/renderer.tsx`** - рендеринг блоков с данными:
   - `renderBlock()` - показывает блок + превью JSON
   - `renderBlockClean()` - только блок с данными (для экспорта)

## Тестирование

### Быстрый тест

1. Откройте проект в Studio
2. Создайте Data Source (MOCK тип)
3. Добавьте Sample с JSON из примеров выше
4. Выберите Hero блок
5. В инспекторе выберите ваш Data Source и Sample
6. Блок должен обновиться с данными из JSON!

### Создание тестовых данных программно

```typescript
import { createDataSource } from "@/lib/data-sources";
import { heroSampleData } from "@/lib/sample-data";

await createDataSource({
  projectId: "your-project-id",
  name: "Test Hero Data",
  type: "MOCK",
  description: "Тестовые данные для Hero блока",
  samples: [
    {
      label: "Example 1",
      payload: heroSampleData,
    },
  ],
});
```

## Следующие шаги

- [ ] UI для настройки custom field mappings в инспекторе
- [ ] Поддержка реальных REST/GraphQL запросов (не только mock)
- [ ] Валидация схемы данных
- [ ] Preview трансформаций в реальном времени
- [ ] Экспорт кода с fetch логикой

## Техническая справка

### Функции утилит

```typescript
// Извлечь значение из объекта по пути
getValueByPath(data, "user.profile.name")
// => "John Doe"

// Применить данные к props блока
applyDataToBlockProps(
  "hero",           // тип блока
  currentProps,      // текущие props
  apiData,          // данные из API
  customMappings    // опциональные кастомные маппинги
)
```

### Маппинги полей

Маппинги определяют, как поля из JSON переносятся в props блока:

```typescript
{
  sourcePath: "user.name",    // путь в JSON
  targetProp: "title"         // поле в props блока
}
```

Система поддерживает:
- Простые поля: `"title"`
- Вложенные объекты: `"user.profile.name"`
- Массивы: `"items[0].title"`
- Transform функции для сложных преобразований

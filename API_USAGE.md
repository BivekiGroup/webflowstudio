# Как работать с реальными API в WebFlow Studio

## Что изменилось

Теперь блоки подключаются к **реальным API** вместо примеров данных!

- ✓ Canvas показывает данные из API (было: только в preview)
- ✓ Убрал автоматический маппинг - теперь **ВСЕГДА ручной выбор полей**
- ✓ Кнопка **"Тест запроса"** - отправляет реальный запрос к API
- ✓ Sample используется **только как схема** (чтобы знать какие поля доступны)

## Быстрый старт (3 шага)

### 1. Создай Data Source

Панель **"Данные"** → **+ Новый источник**

**Пример REST API**:
- Название: "JSONPlaceholder Users"
- Тип: REST
- Endpoint: `https://jsonplaceholder.typicode.com/users`
- Method: GET

### 2. Добавь Sample (как схему)

Sample нужен **только чтобы увидеть структуру** полей! Реальные данные будут из API.

Нажми **"+ Добавить пример"** и вставь пример ответа API:

```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz"
  }
]
```

Label: "User schema"

### 3. Подключи блок к API

1. Выбери Hero блок на canvas
2. Инспектор → **"Источник данных"** → выбери "JSONPlaceholder Users"
3. **Sample**: "User schema" (используется только для просмотра полей!)
4. Нажми **"Тест запроса"** - увидишь реальный ответ API!

### 4. Настрой маппинг полей

В секции **"Маппинг полей API"**:

- `title` → выбери `name` (или `[0].name` если массив)
- `description` → выбери `email`
- `badge` → выбери `username`

Блок автоматически заполнится **реальными данными из API**!

---

## Важно понять

### Sample vs Реальные данные

| Что | Зачем |
|-----|-------|
| **Sample** (пример) | Только для просмотра структуры полей в dropdown |
| **"Тест запроса"** | Делает реальный запрос к API |
| **Canvas** | Показывает данные из sample ИЛИ из теста (если нажал кнопку) |

### Маппинг ВСЕГДА ручной

Автоматический режим **полностью убран**. Теперь ты **сам выбираешь**:

- Какое поле из API → в какой prop блока
- Поддержка вложенных объектов: `user.profile.name`
- Поддержка массивов: `items[0].title`

---

## Примеры с реальными API

### 1. GitHub User API

**Data Source**:
- Endpoint: `https://api.github.com/users/octocat`
- Method: GET
- Type: REST

**Sample для схемы**:
```json
{
  "login": "octocat",
  "name": "The Octocat",
  "bio": "GitHub mascot",
  "public_repos": 8,
  "followers": 1000
}
```

**Маппинг для Hero**:
- `title` → `name`
- `description` → `bio`
- `badge` → `login`

### 2. REST Countries API

**Data Source**:
- Endpoint: `https://restcountries.com/v3.1/name/russia`
- Method: GET

**Sample**:
```json
[
  {
    "name": {
      "common": "Russia"
    },
    "capital": ["Moscow"],
    "population": 144104080
  }
]
```

**Маппинг**:
- `title` → `[0].name.common`
- `description` → `[0].capital[0]`

### 3. Stats блок с API

**Data Source**:
- Endpoint: `https://api.github.com/repos/facebook/react`

**Маппинг для Stats**:
- Создай custom mapping для каждой метрики
- `metrics[0].value` → `stargazers_count`
- `metrics[0].label` → вручную укажи "Stars"
- `metrics[1].value` → `forks_count`

---

## Как работает "Тест запроса"

1. Нажимаешь кнопку **"Тест запроса"**
2. WebFlow отправляет реальный запрос к endpoint
3. Если успешно (✓) - показывает данные
4. Если ошибка (✗) - показывает что пошло не так
5. Эти данные используются в блоке вместо sample!

---

## Типы Data Source

### REST
- Endpoint: любой HTTP/HTTPS URL
- Method: GET, POST, PUT, DELETE
- Headers: можешь добавить Authorization и др.

### GraphQL
- Endpoint: GraphQL endpoint
- Query: пиши GraphQL запрос в config

### MOCK
- Для тестирования без реального API
- Данные из `config.mock`

---

## Технические детали

**Файлы**:
- [src/lib/api-client.ts](src/lib/api-client.ts) - функции для запросов
- [src/lib/data-binding.ts](src/lib/data-binding.ts) - маппинг данных (только ручной)
- [src/app/dashboard/projects/field-mapping-editor.tsx](src/app/dashboard/projects/field-mapping-editor.tsx) - UI выбора полей

**Функции**:
- `fetchApiData()` - делает реальный запрос
- `applyDataToBlockProps()` - применяет ТОЛЬКО явный маппинг
- `getValueByPath()` - извлекает данные по пути

---

## Что дальше

- [ ] Автоматическое обновление данных (polling)
- [ ] Кеширование ответов API
- [ ] Обработка ошибок с retry
- [ ] WebSocket поддержка
- [ ] Authentication flows (OAuth, JWT)

/**
 * Примеры данных для тестирования data bindings
 * Эти структуры соответствуют маппингам в defaultBlockMappings
 */

export const heroSampleData = {
  badge: "API Ready",
  title: "Данные загружены из API",
  description: "Этот блок автоматически заполнен данными из примера API ответа. Измените маппинг полей для настройки.",
  primaryButton: "Начать работу",
  secondaryButton: "Узнать больше",
};

export const statsSampleData = {
  metrics: [
    {
      label: "Пользователи",
      value: "2.5K",
      detail: "Активных пользователей сегодня",
    },
    {
      label: "API Calls",
      value: "45.2M",
      detail: "Запросов за последний месяц",
    },
    {
      label: "Uptime",
      value: "99.9%",
      detail: "За последние 30 дней",
    },
  ],
};

export const workflowSampleData = {
  stages: [
    {
      id: "fetch",
      label: "Получение данных",
      title: "Fetch API Data",
      description: "Получаем данные из внешнего REST API с автоматической retry логикой",
      tags: ["REST", "GraphQL"],
    },
    {
      id: "transform",
      label: "Трансформация",
      title: "Transform & Validate",
      description: "Валидируем схему и трансформируем данные в нужный формат",
      tags: ["Validation", "Mapping"],
    },
    {
      id: "render",
      label: "Рендеринг",
      title: "Render UI",
      description: "Отображаем данные в компонентах интерфейса",
      tags: ["React", "UI"],
    },
  ],
};

export const ctaSampleData = {
  badge: "Live Demo",
  title: "Попробуйте прямо сейчас",
  description: "Подключите свой API endpoint и увидите результат в режиме реального времени",
  primaryButton: "Подключить API",
  secondaryButton: "Смотреть документацию",
};

export const formSampleData = {
  title: "Обратная связь",
  description: "Отправьте ваш вопрос или предложение, и мы ответим в течение 24 часов",
  emailLabel: "Ваш email",
  commentLabel: "Сообщение",
  submitLabel: "Отправить запрос",
};

/**
 * Пример ответа API для Stats блока (альтернативная структура)
 * Показывает как можно работать с разными форматами ответов
 */
export const statsAlternativeFormat = {
  analytics: {
    users: {
      count: 15240,
      name: "Total Users",
      description: "Registered in the system",
    },
    revenue: {
      count: "$142K",
      name: "Revenue",
      description: "Monthly recurring revenue",
    },
    conversion: {
      count: "12.5%",
      name: "Conversion",
      description: "Sign-up to paid conversion rate",
    },
  },
};

/**
 * Пример сложного API ответа с вложенными данными
 */
export const nestedApiResponse = {
  success: true,
  data: {
    hero: {
      badge: "v2.0",
      title: "Вложенные данные работают",
      description: "Система поддерживает извлечение данных из вложенных объектов через field path",
      actions: {
        primary: "Открыть проект",
        secondary: "Читать FAQ",
      },
    },
    metadata: {
      timestamp: "2025-01-15T10:30:00Z",
      version: "2.0.0",
    },
  },
};

/**
 * Пример API ответа с массивами
 */
export const arrayApiResponse = {
  products: [
    {
      id: 1,
      name: "Premium Plan",
      price: "$49/mo",
      features: ["Unlimited projects", "Priority support"],
    },
    {
      id: 2,
      name: "Enterprise Plan",
      price: "$199/mo",
      features: ["Custom integration", "SLA guarantee"],
    },
  ],
  featured: {
    name: "Starter Pack",
    price: "$9/mo",
    description: "Perfect for small teams",
  },
};

/**
 * Все примеры для быстрого доступа
 */
export const allSamples = {
  hero: heroSampleData,
  stats: statsSampleData,
  workflow: workflowSampleData,
  cta: ctaSampleData,
  form: formSampleData,
  statsAlt: statsAlternativeFormat,
  nested: nestedApiResponse,
  array: arrayApiResponse,
};

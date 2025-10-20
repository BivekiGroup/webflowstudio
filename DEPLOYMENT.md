# Деплой WebFlow Studio через Docker Compose

Инструкция по развертыванию WebFlow Studio в production с использованием Docker Compose и внешней PostgreSQL базы данных (DBaaS).

---

## Требования

- **Docker**: версия 20.10+
- **Docker Compose**: версия 2.0+
- **PostgreSQL DBaaS**: Supabase, Yandex Cloud, AWS RDS, или любой другой провайдер
- **Сервер**: VPS/VDS с минимум 2GB RAM

---

## Шаг 1: Подготовка базы данных

### Создайте PostgreSQL базу данных у провайдера:

**Рекомендуемые провайдеры:**
- [Supabase](https://supabase.com) - бесплатный план 500MB
- [Yandex Managed Service for PostgreSQL](https://cloud.yandex.ru/services/managed-postgresql)
- AWS RDS PostgreSQL
- DigitalOcean Managed Databases

### Получите строку подключения:

Формат: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

Пример:
```
postgresql://postgres:your_password@db.example.supabase.co:5432/postgres
```

---

## Шаг 2: Подготовка сервера

### 1. Клонируйте репозиторий:

```bash
git clone <your-repo-url>
cd webflowstudio
```

### 2. Создайте файл stack.env:

```bash
cp stack.env.example stack.env
nano stack.env
```

### 3. Заполните переменные окружения:

```env
# Обязательные переменные
DATABASE_URL=postgresql://user:password@your-host:5432/webflowstudio
NEXTAUTH_URL=https://webflowstudio.ru
NEXTAUTH_SECRET=<сгенерируйте-случайную-строку>

# Опционально
PORT=3000
```

**Генерация NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Шаг 3: Применение миграций базы данных

Перед первым запуском примените миграции Prisma:

```bash
# Установите зависимости локально (если еще не установлены)
npm install

# Примените миграции к вашей DBaaS
npx prisma migrate deploy

# Или используйте db push если миграций нет
npx prisma db push
```

---

## Шаг 4: Сборка и запуск

### Вариант A: Через Docker Compose (рекомендуется)

```bash
# Сборка образа
docker compose build

# Запуск в фоновом режиме
docker compose up -d

# Проверка логов
docker compose logs -f
```

### Вариант B: Только Docker

```bash
# Сборка
docker build -t webflowstudio:latest .

# Запуск
docker run -d \
  --name webflowstudio \
  --env-file stack.env \
  -p 3000:3000 \
  --restart unless-stopped \
  webflowstudio:latest
```

---

## Шаг 5: Настройка Reverse Proxy (Nginx/Caddy)

### Пример конфигурации Nginx:

```nginx
server {
    listen 80;
    server_name webflowstudio.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Настройка SSL с Let's Encrypt:

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d webflowstudio.ru
```

---

## Управление контейнером

```bash
# Просмотр статуса
docker compose ps

# Просмотр логов
docker compose logs -f web

# Рестарт
docker compose restart

# Остановка
docker compose stop

# Полное удаление
docker compose down

# Обновление после изменений кода
docker compose build --no-cache
docker compose up -d
```

---

## Обновление приложения

```bash
# 1. Остановите контейнер
docker compose down

# 2. Получите новый код
git pull origin main

# 3. Примените новые миграции (если есть)
npx prisma migrate deploy

# 4. Пересоберите образ
docker compose build --no-cache

# 5. Запустите обновленную версию
docker compose up -d
```

---

## Мониторинг и логи

### Просмотр логов в реальном времени:
```bash
docker compose logs -f web
```

### Проверка здоровья контейнера:
```bash
docker compose ps
```

### Вход в контейнер для отладки:
```bash
docker compose exec web sh
```

---

## Решение проблем

### Проблема: Контейнер не запускается

**Решение:**
```bash
# Проверьте логи
docker compose logs web

# Проверьте переменные окружения
docker compose config
```

### Проблема: Ошибка подключения к базе данных

**Решение:**
- Проверьте правильность DATABASE_URL
- Убедитесь что ваша DBaaS разрешает подключения с IP вашего сервера
- Проверьте что миграции были применены: `npx prisma migrate deploy`

### Проблема: 502 Bad Gateway в Nginx

**Решение:**
```bash
# Проверьте что контейнер запущен
docker compose ps

# Проверьте что порт 3000 открыт
curl http://localhost:3000
```

---

## Бэкапы базы данных

Поскольку вы используете DBaaS, бэкапы настраиваются в панели управления провайдера:

- **Supabase**: автоматические бэкапы включены по умолчанию
- **Yandex Cloud**: настройте автоматическое резервное копирование в консоли
- **AWS RDS**: включите automated backups

---

## Безопасность

### Рекомендации:

1. **Firewall**: Открывайте только необходимые порты (80, 443)
2. **HTTPS**: Обязательно используйте SSL сертификаты
3. **Environment**: Никогда не коммитьте stack.env в Git
4. **Updates**: Регулярно обновляйте Docker образы и зависимости
5. **Secrets**: Используйте Docker Secrets для чувствительных данных в production

---

## Production Checklist

- [ ] База данных настроена и доступна
- [ ] stack.env создан и заполнен
- [ ] Применены миграции Prisma
- [ ] Docker Compose запущен и работает
- [ ] Nginx/Reverse proxy настроен
- [ ] SSL сертификат установлен
- [ ] Домен настроен и указывает на сервер
- [ ] Логи проверены, ошибок нет
- [ ] Healthcheck возвращает 200 OK
- [ ] Бэкапы базы данных настроены

---

## Поддержка

При возникновении проблем:
1. Проверьте логи: `docker compose logs -f`
2. Проверьте статус: `docker compose ps`
3. Проверьте переменные окружения: `docker compose config`

Документация проекта: [README.md](./README.md)

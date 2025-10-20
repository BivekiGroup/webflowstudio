# Docker Quick Start - WebFlow Studio

Быстрый старт для деплоя WebFlow Studio через Docker Compose.

## Требования

- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL DBaaS (база данных уже должна быть создана)

## Быстрый запуск за 5 минут

### 1. Создайте stack.env

```bash
cp stack.env.example stack.env
nano stack.env
```

Заполните минимум 3 переменные:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 2. Примените миграции к базе данных

```bash
npm install
npx prisma migrate deploy
```

### 3. Запустите Docker Compose

```bash
docker compose up -d
```

### 4. Проверьте статус

```bash
# Проверка логов
docker compose logs -f

# Проверка health
curl http://localhost:3000/api/health

# Должен вернуть: {"status":"ok",...}
```

## Готово!

Приложение доступно на `http://localhost:3000`

---

## Часто используемые команды

```bash
# Перезапуск
docker compose restart

# Остановка
docker compose stop

# Запуск
docker compose start

# Просмотр логов
docker compose logs -f web

# Пересборка после изменений
docker compose build --no-cache && docker compose up -d

# Полная остановка и удаление
docker compose down
```

---

## Настройка Nginx (опционально)

Создайте `/etc/nginx/sites-available/webflowstudio`:

```nginx
server {
    listen 80;
    server_name webflowstudio.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфиг и настройте SSL:
```bash
sudo ln -s /etc/nginx/sites-available/webflowstudio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d webflowstudio.ru
```

---

## Решение проблем

### Контейнер не запускается?
```bash
docker compose logs web
```

### Ошибка подключения к БД?
- Проверьте DATABASE_URL в stack.env
- Убедитесь что ваша DBaaS разрешает подключения с IP сервера
- Проверьте что миграции применены

### Нужна полная документация?
Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Обновление приложения

```bash
git pull
docker compose build --no-cache
npx prisma migrate deploy
docker compose up -d
```

---

## Мониторинг

Health check endpoint: `http://localhost:3000/api/health`

Настройте мониторинг (UptimeRobot, Pingdom) для проверки доступности.

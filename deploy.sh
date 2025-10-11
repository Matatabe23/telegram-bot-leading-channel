#!/usr/bin/env bash
set -e

APP_DIR="/home/prod"
NGINX_TEMPLATE="$APP_DIR/nginx.conf.template"
NGINX_CONFIG="$APP_DIR/nginx.conf"

# Переход в директорию приложения
cd "$APP_DIR" || exit 1

# Функция для красивого вывода этапов
log() {
    echo -e "\n=== $1 ===\n"
}

# Начало деплоя
log "🚀 Деплой начат: $(date)"

# Сброс и стягивание последней версии
log "➤ Сброс и стягивание последней версии..."
git fetch
git reset --hard origin/main
git pull

# Генерация nginx.conf из шаблона
log "➤ Генерация nginx.conf из шаблона..."
set -o allexport
source <(grep -v '^#' .env | tr -d '\r')
set +o allexport
envsubst '${MY_DOMAIN}' < "$NGINX_TEMPLATE" > "$NGINX_CONFIG"
log "✅ nginx.conf сгенерирован успешно."

# Пересборка контейнеров (вывод в консоль в реальном времени)
log "➤ Пересборка контейнеров..."
docker compose build --no-cache

# Запуск контейнеров
log "➤ Запуск контейнеров..."
docker compose up -d

# Завершение деплоя
log "✅ Деплой завершён: $(date)"

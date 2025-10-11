#!/usr/bin/env bash
set -e

APP_DIR="/home/prod"
LOG_DIR="$APP_DIR/data/deploy"
LOG_FILE="$LOG_DIR/deploy.log"
NGINX_TEMPLATE="$APP_DIR/nginx.conf.template"
NGINX_CONFIG="$APP_DIR/nginx.conf"

# Создание папки логов, если её нет
mkdir -p "$LOG_DIR"

# Переход в директорию приложения
cd "$APP_DIR" || exit 1

# Функция для логирования и одновременного вывода в консоль
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Начало деплоя
log "=== 🚀 Деплой начат: $(date)"

# Сброс и стягивание последней версии
log "➤ Сброс и стягивание последней версии..."
git fetch 2>&1 | tee -a "$LOG_FILE"
git reset --hard origin/main 2>&1 | tee -a "$LOG_FILE"
git pull 2>&1 | tee -a "$LOG_FILE"

# Генерация nginx.conf из шаблона
log "➤ Генерация nginx.conf из шаблона..."
set -o allexport
source <(grep -v '^#' .env | tr -d '\r')
set +o allexport
envsubst '${MY_DOMAIN}' < "$NGINX_TEMPLATE" | tee "$NGINX_CONFIG" | tee -a "$LOG_FILE"
log "✅ nginx.conf сгенерирован успешно."

# Пересборка контейнеров
log "➤ Пересборка контейнеров..."
docker compose build --no-cache 2>&1 | tee -a "$LOG_FILE"
docker compose up -d 2>&1 | tee -a "$LOG_FILE"

# Завершение деплоя
log "✅ Деплой завершён: $(date)"

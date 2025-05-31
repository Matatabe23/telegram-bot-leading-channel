APP_DIR="/home/prod"
LOG_DIR="$APP_DIR/data/deploy"
LOG_FILE="$LOG_DIR/deploy.log"

mkdir -p "$LOG_DIR"

cd "$APP_DIR" || exit 1

echo "=== Деплой начат: $(date)" >> "$LOG_FILE" 2>&1

echo "➤ Сброс и стягивание последней версии..." | tee -a "$LOG_FILE"
git pull >> "$LOG_FILE" 2>&1

echo "➤ Пересборка контейнеров..." | tee -a "$LOG_FILE"
docker compose build --no-cache >> "$LOG_FILE" 2>&1
docker compose up -d >> "$LOG_FILE" 2>&1

echo "✅ Деплой завершён: $(date)" >> "$LOG_FILE" 2>&1

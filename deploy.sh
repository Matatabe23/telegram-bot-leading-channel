APP_DIR="/home/prod"
LOG_DIR="$APP_DIR/data/deploy"
LOG_FILE="$LOG_DIR/deploy.log"
NGINX_TEMPLATE="$APP_DIR/nginx.conf.template"
NGINX_CONFIG="$APP_DIR/nginx.conf"

mkdir -p "$LOG_DIR"

cd "$APP_DIR" || exit 1

echo "=== Деплой начат: $(date)" >> "$LOG_FILE" 2>&1

echo "➤ Сброс и стягивание последней версии..." | tee -a "$LOG_FILE"
git pull >> "$LOG_FILE" 2>&1

echo "➤ Генерация nginx.conf из шаблона..." | tee -a "$LOG_FILE"

# Загрузка переменных из .env и генерация nginx.conf
set -o allexport
source <(grep -v '^#' .env | tr -d '\r')
set +o allexport

envsubst '${MY_DOMAIN}' < "$NGINX_TEMPLATE" > "$NGINX_CONFIG"
echo "nginx.conf сгенерирован успешно." | tee -a "$LOG_FILE"

echo "➤ Пересборка контейнеров..." | tee -a "$LOG_FILE"
docker compose build --no-cache >> "$LOG_FILE" 2>&1
docker compose up -d >> "$LOG_FILE" 2>&1

echo "✅ Деплой завершён: $(date)" >> "$LOG_FILE" 2>&1

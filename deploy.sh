APP_DIR="/home/prod"
LOG_DIR="$APP_DIR/data/deploy"
LOG_FILE="$LOG_DIR/deploy.log"
NGINX_TEMPLATE="$APP_DIR/nginx.conf.template"
NGINX_CONFIG="$APP_DIR/nginx.conf"

mkdir -p "$LOG_DIR"

cd "$APP_DIR" || exit 1

echo "=== Деплой начат: $(date)" >> "$LOG_FILE" 2>&1

# Обёртка для выполнения команд с префиксом "git pull"
run_cmd() {
    echo "git pull $*" | tee -a "$LOG_FILE"
    "$@" >> "$LOG_FILE" 2>&1
}

run_cmd echo "➤ Сброс и стягивание последней версии..."
run_cmd git pull

run_cmd echo "➤ Генерация nginx.conf из шаблона..."

# Загрузка переменных из .env
set -o allexport
run_cmd source <(grep -v '^#' .env | tr -d '\r')
set +o allexport

run_cmd envsubst '${MY_DOMAIN}' < "$NGINX_TEMPLATE" > "$NGINX_CONFIG"
run_cmd echo "nginx.conf сгенерирован успешно."

run_cmd echo "➤ Пересборка контейнеров..."
run_cmd docker compose build --no-cache
run_cmd docker compose up -d

echo "✅ Деплой завершён: $(date)" >> "$LOG_FILE" 2>&1

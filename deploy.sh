APP_DIR="/home/prod"

cd "$APP_DIR" || exit 1

echo "➤ Сброс и стягивание последней версии..."
git pull

echo "➤ Пересборка контейнеров..."
docker compose build --no-cache
docker compose up -d

echo "✅ Деплой завершён: $(date)"

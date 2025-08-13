# Telegram Bot Leading Channel

Бот для управления Telegram-каналом. Позволяет автоматизировать публикации, управление участниками и выполнение различных команд в канале.

## Используемые технологии

### Frontend
- Vue 3
- Vite
- Vuetify 3
- Pinia
- Vue Router
- Axios
- Vue Draggable
- Vue Lazyload
- Swiper
- Tauri

### Backend
- NestJS
- Node.js
- MySQL
- Sequelize + Sequelize Typescript
- Socket.IO
- JWT + Passport
- Swagger
- Node-Telegram-Bot-API
- AWS S3 (для хранения файлов и изображений)
- Bcrypt (для хэширования паролей)
- Class Validator + Class Transformer
- Sharp (для обработки изображений)
- Moment / Date-fns (для работы с датами)
- Node-schedule (для планировщика задач)

### Dev tools
- TypeScript
- ESLint + Prettier
- Docker & docker-compose
- Nginx
- TailwindCSS, PostCSS

## Установка
1. Клонировать репозиторий
```bash
git clone <repo-url>
cd telegram-bot-leading-channel
```
2. Настроить переменные окружения в .env
```bash
PROJECT_NAME - название проекта
MY_DOMAIN - основной домен

# === MySQL ===
MYSQL_DATABASE - имя базы данных
MYSQL_ROOT_USER - root пользователь MySQL
MYSQL_ROOT_PASSWORD - пароль root пользователя MySQL
MYSQL_ADMIN_USER - админ пользователь базы
MYSQL_ADMIN_PASSWORD - пароль админ пользователя базы

# === Bot ===
APP_PORT - порт приложения
TELEGRAM_BOT_API_TOKEN - токен Telegram бота
SECRET_KEY_ACCESS - секретный ключ для access-токена
SECRET_KEY_REFRESH - секретный ключ для refresh-токена

S3_BUCKET_NAME - имя S3 бакета
S3_ACCESS_KEY_ID - ключ доступа S3
S3_SECRET_ACCESS_KEY - секретный ключ S3
S3_FOLDER_SAVED - папка для сохранения файлов
S3_PATH - базовый URL для S3

DEFAULT_USER_NAME - имя пользователя по умолчанию
DEFAULT_ROLE - роль пользователя по умолчанию

# === Frontend ===
VITE_APP_BACKEND_API_URL - URL backend API для фронтенда
```

3. Запустить docker-compose
```bash
docker-compose up -d
```

## Для локальной разработки:
Frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend:
```bash
cd bot
npm install
npm run start:dev
```

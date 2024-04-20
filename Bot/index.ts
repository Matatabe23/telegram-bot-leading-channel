require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TELEGRAM_BOT_TOKEN;

// Создание экземпляра бота
const bot = new TelegramBot(token, { polling: true });

// ID вашего канала (можно найти через бота @userinfobot)
const channelId = process.env.CHAT_ID_DEV;

// Функция для публикации сообщений в канал
function publishToChannel(message: string) {
  bot.sendMessage(channelId, message);
}

// Пример использования
const message = 'Новый пост в канале!';
publishToChannel(message);

const TelegramBot = require('node-telegram-bot-api');
const {sendMessageAtScheduledTime} = require('./sendMessageAtScheduledTime')

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true });

// Вызов функции для регулярной публикации сообщений
sendMessageAtScheduledTime(bot);
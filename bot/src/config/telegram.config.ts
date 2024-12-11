import * as TelegramBot from 'node-telegram-bot-api';

export const createTelegramBot = (): TelegramBot => {
	if (!process.env.TELEGRAM_BOT_API_TOKEN) {
		throw new Error('Не задан TELEGRAM_BOT_API_TOKEN в переменных окружения');
	}

	return new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, {
		polling: true
	});
};

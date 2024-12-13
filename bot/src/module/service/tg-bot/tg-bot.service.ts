import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TGBotService {
	private readonly bot: TelegramBot;

	constructor(private configService: ConfigService) {
		const token = this.configService.get<string>('TELEGRAM_BOT_API_TOKEN');
		if (!token) {
			throw new Error('Не задан TELEGRAM_BOT_API_TOKEN в переменных окружения');
		}

		this.bot = new TelegramBot(token, { polling: true });
	}

	getBot(): TelegramBot {
		return this.bot;
	}
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

interface SessionData {
	step: string;
	data: any;
}

@Injectable()
export class TGBotService {
	private readonly bot: TelegramBot;
	private readonly sessions: Map<number, SessionData> = new Map();

	constructor(private configService: ConfigService) {
		const token = this.configService.get<string>('TELEGRAM_BOT_API_TOKEN');
		if (!token) {
			throw new Error('Не задан TELEGRAM_BOT_API_TOKEN в переменных окружения');
		}

		this.bot = new TelegramBot(token, { polling: true });
		this.initializeDefaultMenu();
	}

	getBot(): TelegramBot {
		return this.bot;
	}

	getSession(chatId: number): SessionData {
		if (!this.sessions.has(chatId)) {
			this.sessions.set(chatId, { step: 'default', data: {} });
		}
		return this.sessions.get(chatId);
	}

	setSession(chatId: number, sessionData: Partial<SessionData>) {
		const currentSession = this.getSession(chatId);
		this.sessions.set(chatId, { ...currentSession, ...sessionData });
	}

	private initializeDefaultMenu() {
		this.bot.onText(/\/start/, async (msg) => {
			const chatId = msg.chat.id;
			await this.bot.sendMessage(chatId, 'Добро пожаловать');
		});
	}
}

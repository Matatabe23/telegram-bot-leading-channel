import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { TGBotUsersRepository } from './tg-bot-users.repository';
import { YuKassaRepository } from '../../payments/repository/yu-kassa.repository';

@Injectable()
export class TGBotRepository {
	private readonly logger = new Logger(TGBotRepository.name);
	public bot: TelegramBot;

	constructor(
		private readonly tgBotService: TGBotService,
		private readonly tGBotUsersRepository: TGBotUsersRepository,
		private readonly yuKassaRepository: YuKassaRepository
	) {
		this.bot = this.tgBotService.getBot();
		this.initializeMessageHandlers();
	}

	private initializeMessageHandlers() {
		this.bot.on('message', async (msg: TelegramBot) => {
			const chatId = msg.chat.id;
			const text = msg.text;
			console.log(msg);

			this.logger.log(`Получено сообщение из чата ${chatId}: ${text}`);

			try {
				await this.tGBotUsersRepository.ensureUserExists(msg.from.id, msg.from.username);

				if (text) {
					await this.handleTextMessage(chatId, text);
				}
			} catch (error) {
				this.logger.error('Ошибка при обработке сообщения:', error);
			}
		});
	}

	private async handleTextMessage(chatId: number, text: string) {
		try {
			if (text.toLowerCase().includes('/start')) {
				await this.bot.sendMessage(chatId, 'Привет! Я Милана, чем могу помочь?');
			} else if (text.toLowerCase().includes('/pay')) {
				this.yuKassaRepository.pay(chatId);
			} else {
				await this.bot.sendMessage(chatId, 'Не понимаю');
			}
		} catch (e) {
			await this.bot.sendMessage(chatId, 'Ошибка');
		}
	}
}

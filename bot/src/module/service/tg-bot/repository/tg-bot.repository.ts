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
		this.bot.on('message', async (msg) => {
			const chatId = msg.chat.id;
			const text = msg.text;
			const session = this.tgBotService.getSession(chatId);
			// console.log(msg);

			this.logger.log(`Получено сообщение из чата ${chatId}: ${text}`);

			try {
				await this.tGBotUsersRepository.ensureUserExists(
					msg.from.id,
					msg.from.username || msg.from.first_name
				);

				this.tgBotService.setSession(chatId, session);
			} catch (error) {
				this.logger.error('Ошибка при обработке сообщения:', error);
				await this.bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте ещё раз.');
			}
		});
	}
}

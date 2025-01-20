import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { TGBotUsersRepository } from './tg-bot-users.repository';
import { YuKassaRepository } from '../../payments/repository/yu-kassa.repository';
import { TGBotAdvertisementRepository } from './tg-bot-advertisement.repository';
import { instructions } from 'src/const/const';

@Injectable()
export class TGBotRepository {
	private readonly logger = new Logger(TGBotRepository.name);
	public bot: TelegramBot;

	constructor(
		private readonly tgBotService: TGBotService,
		private readonly tGBotUsersRepository: TGBotUsersRepository,
		private readonly yuKassaRepository: YuKassaRepository,
		private readonly tGBotAdvertisementRepository: TGBotAdvertisementRepository
	) {
		this.bot = this.tgBotService.getBot();
		this.initializeMessageHandlers();
	}

	private initializeMessageHandlers() {
		this.bot.on('message', async (msg: TelegramBot) => {
			const chatId = msg.chat.id;
			const text = msg.text;

			this.logger.log(`Получено сообщение из чата ${chatId}: ${text}`);

			try {
				await this.tGBotUsersRepository.ensureUserExists(msg.from.id, msg.from.username);

				if (text) {
					await this.handleTextMessage(msg);
				}
			} catch (error) {
				this.logger.error('Ошибка при обработке сообщения:', error);
			}
		});
	}

	private async handleTextMessage(msg: TelegramBot) {
		const chatId = msg.chat.id;
		const text = msg.text;
		try {
			if (text.toLowerCase().includes('/start'.toLowerCase())) {
				await this.bot.sendMessage(chatId, instructions.join('\n'));
			} else if (text.toLowerCase().includes('/pay'.toLowerCase())) {
				this.yuKassaRepository.pay(chatId);
			} else if (text.toLowerCase().includes('/addAdvertisement'.toLowerCase())) {
				this.tGBotAdvertisementRepository.addAdvertisement(msg);
			} else if (text.toLowerCase().includes('/getMyListAdvertisement'.toLowerCase())) {
				this.tGBotAdvertisementRepository.getMyListAdvertisement(msg);
			}
		} catch (e) {
			await this.bot.sendMessage(chatId, 'Ошибка');
		}
	}
}

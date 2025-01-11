import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';
import { Users } from 'src/module/db/models/users.repository';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { Advertisement } from 'src/module/db/models/advertisement.repository';
import { EAdvertisementStatus } from 'src/types/types';

@Injectable()
export class TGBotAdvertisementRepository {
	public bot: TelegramBot;
	private readonly timeout: number = 1 * 60 * 1000;
	private currentTimeout: NodeJS.Timeout;

	constructor(
		private readonly tgBotService: TGBotService,
		@InjectModel(Users)
		private readonly users: typeof Users,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement
	) {
		this.bot = this.tgBotService.getBot();
	}

	public async addAdvertisement(msg: TelegramBot.Message) {
		const user = await this.users.findOne({ where: { telegramId: msg.from?.id } });
		const chatId = msg.chat.id;

		if (!user.isTeamMember) {
			const count = await this.advertisement.count({
				where: {
					sourceChatId: chatId,
					userId: user?.id
				}
			});

			if (count >= 5) {
				await this.bot.sendMessage(
					msg.chat.id,
					'Одному пользователю положено иметь только 5 постов'
				);
				return;
			}
		}

		if (this.currentTimeout) {
			clearTimeout(this.currentTimeout);
		}

		await this.bot.sendMessage(
			msg.chat.id,
			'Пожалуйста, отправьте рекламу в течение 1 минуты.'
		);

		this.currentTimeout = setTimeout(async () => {
			await this.bot.sendMessage(msg.chat.id, 'Время истекло. Реклама не была получена.');
		}, this.timeout);

		const onMessage = async (message: TelegramBot.Message) => {
			if (message.text?.startsWith('/')) {
				clearTimeout(this.currentTimeout);
				return;
			}

			await this.advertisement.create({
				sourceChatId: msg.chat.id,
				messageId: message.message_id,
				userId: user?.id,
				moderationStatus: EAdvertisementStatus.CREATED
			});

			await this.bot.sendMessage(
				msg.chat.id,
				`Реклама получена и сохранена. \n\nНЕ УДАЛЯЙТЕ И НЕ ИЗМЕНЯЙТЕ СООБЩЕНИЕ! ИНАЧЕ РЕКЛАМА НЕ СРАБОТАЕТ`,
				{
					reply_to_message_id: message.message_id
				}
			);

			clearTimeout(this.currentTimeout);

			this.bot.removeListener('message', onMessage);
		};

		this.bot.on('message', onMessage);
	}

	public async checkEditAdvertisement(msg: TelegramBot.Message) {
		const chatId = msg.chat.id;
		const messageId = msg.message_id;

		const advertisement = await this.advertisement.findOne({
			where: { sourceChatId: chatId, messageId: messageId }
		});

		advertisement.moderationStatus = EAdvertisementStatus.DRAFT;
		await advertisement.save();

		await this.bot.sendMessage(chatId, 'Вы изменили рекламу, её статус верефикации сброшен', {
			reply_to_message_id: messageId
		});
	}

	public async getMyListAdvertisement(msg: TelegramBot.Message) {
		const chatId = msg.chat.id;
		const user = await this.users.findOne({ where: { telegramId: msg.from?.id } });

		if (!user) {
			await this.bot.sendMessage(chatId, 'Пользователь не найден.');
			return;
		}

		// Получаем все рекламные сообщения пользователя для текущего чата
		const advertisements = await this.advertisement.findAll({
			where: { sourceChatId: chatId, userId: user.id }
		});

		if (advertisements.length === 0) {
			await this.bot.sendMessage(
				chatId,
				'У вас нет размещенных рекламных постов в этом чате.'
			);
			return;
		}

		// Формируем клавиатуру с кнопками для каждого поста
		const inlineKeyboard = advertisements.map((ad) => ({
			text: `Пост #${ad.id}`,
			callback_data: `view_post_${ad.id}` // Уникальный callback для каждого поста
		}));

		await this.bot.sendMessage(chatId, 'Выберите пост для пересылки:', {
			reply_markup: {
				inline_keyboard: [inlineKeyboard] // Кнопки для каждого поста
			}
		});

		this.bot.on('callback_query', async (query) => {
			if (query.message?.chat.id === chatId) {
				const postId = query.data?.split('_')[2];
				if (postId) {
					const advertisement = await this.advertisement.findOne({
						where: { id: parseInt(postId) }
					});

					if (advertisement) {
						await this.bot.copyMessage(
							chatId,
							advertisement.sourceChatId,
							advertisement.messageId
						);
					}
				}
			}
		});
	}
}

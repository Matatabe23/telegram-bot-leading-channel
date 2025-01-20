import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';
import { Users } from 'src/module/db/models/users.repository';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { Advertisement } from 'src/module/db/models/advertisement.repository';
import { EAdvertisementStatus, ETypePostsAdvertisement, ISettingChannels } from 'src/types/types';
import { advertisementStatus } from 'src/const/const';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { HelpersRepository } from '../../helpers/helpers.repository';
import { Channels } from 'src/module/db/models/channels.repository';

@Injectable()
export class TGBotAdvertisementRepository {
	public bot: TelegramBot;
	private readonly timeout: number = 1 * 60 * 1000;
	private currentTimeout: NodeJS.Timeout;

	constructor(
		private readonly tgBotService: TGBotService,
		private readonly helpersRepository: HelpersRepository,
		@InjectModel(Users)
		private readonly users: typeof Users,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime
	) {
		this.bot = this.tgBotService.getBot();
	}

	private activeListeners = new Map<number, (...args: any[]) => void>();
	private activeCallbackListeners = new Map<number, (query: TelegramBot.CallbackQuery) => void>();

	public async addAdvertisement(msg: TelegramBot.Message) {
		const user = await this.users.findOne({ where: { telegramId: msg.from?.id } });
		const chatId = msg.chat.id;

		if (!user?.isTeamMember) {
			const count = await this.advertisement.count({
				where: {
					sourceChatId: chatId,
					userId: user?.id
				}
			});

			if (count >= 5) {
				await this.bot.sendMessage(
					chatId,
					'Одному пользователю положено иметь только 5 постов'
				);
				return;
			}
		}

		if (this.activeListeners.has(chatId)) {
			const previousListener = this.activeListeners.get(chatId);
			this.bot.removeListener('message', previousListener!);
			this.activeListeners.delete(chatId);
		}

		await this.bot.sendMessage(chatId, 'Пожалуйста, отправьте рекламу в течение 1 минуты.');

		const timeoutId = setTimeout(async () => {
			await this.bot.sendMessage(chatId, 'Время истекло. Реклама не была получена.');
			if (this.activeListeners.has(chatId)) {
				const listener = this.activeListeners.get(chatId);
				this.bot.removeListener('message', listener!);
				this.activeListeners.delete(chatId);
			}
		}, this.timeout);

		const onMessage = async (message: TelegramBot.Message) => {
			if (message.chat.id !== chatId) return;

			if (!message.text && !message.caption) {
				return;
			}

			if (message.text?.startsWith('/')) {
				clearTimeout(timeoutId);
				this.bot.removeListener('message', onMessage);
				this.activeListeners.delete(chatId);
				return;
			}

			const sentMessage = await this.bot.copyMessage(chatId, chatId, message.message_id);

			await this.advertisement.create({
				sourceChatId: chatId,
				messageId: sentMessage.message_id,
				userId: user?.id,
				moderationStatus: EAdvertisementStatus.CREATED
			});

			await this.bot.sendMessage(chatId, 'Реклама получена и сохранена.', {
				reply_to_message_id: sentMessage.message_id
			});

			clearTimeout(timeoutId);
			this.bot.removeListener('message', onMessage);
			this.activeListeners.delete(chatId);
		};

		this.activeListeners.set(chatId, onMessage);

		this.bot.on('message', onMessage);
	}

	// Получение списка рекламных постов пользователя
	public async getMyListAdvertisement(msg: TelegramBot.Message) {
		const chatId = msg.chat.id;
		const user = await this.getUserByTelegramId(msg.from?.id);

		if (!user) {
			await this.bot.sendMessage(chatId, 'Пользователь не найден.');
			return;
		}

		const advertisements = await this.getActiveAdvertisements(chatId, user.id);

		if (advertisements.length === 0) {
			await this.bot.sendMessage(
				chatId,
				'У вас нет размещенных рекламных постов в этом чате.'
			);
			return;
		}

		const inlineKeyboard = this.createAdvertisementKeyboard(advertisements);

		await this.bot.sendMessage(chatId, 'Выберите пост для взаимодействия:', {
			reply_markup: { inline_keyboard: inlineKeyboard }
		});

		// Удаляем предыдущий обработчик для этого чата, если он существует
		if (this.activeCallbackListeners.has(chatId)) {
			const previousListener = this.activeCallbackListeners.get(chatId);
			this.bot.removeListener('callback_query', previousListener!);
			this.activeCallbackListeners.delete(chatId);
		}

		// Создаем новый обработчик для этого чата
		const onCallbackQuery = (query: TelegramBot.CallbackQuery) => {
			if (query.message?.chat.id !== chatId) return; // Игнорируем события из других чатов
			this.handleCallbackQuery(query, chatId);
		};

		// Сохраняем обработчик в Map
		this.activeCallbackListeners.set(chatId, onCallbackQuery);

		// Добавляем обработчик
		this.bot.on('callback_query', onCallbackQuery);
	}

	// Получение пользователя по Telegram ID
	private async getUserByTelegramId(telegramId: number | undefined) {
		return this.users.findOne({ where: { telegramId } });
	}

	// Получение активных рекламных постов
	private async getActiveAdvertisements(chatId: number, userId: number) {
		const res = await this.advertisement.findAll({ where: { sourceChatId: chatId, userId } });
		return res.filter((item) => item.moderationStatus !== EAdvertisementStatus.ARCHIVED);
	}

	// Создание клавиатуры с рекламными постами
	private createAdvertisementKeyboard(advertisements: any[]) {
		const inlineKeyboard = [];
		for (let i = 0; i < advertisements.length; i += 2) {
			const row = [
				{
					text: `Пост #${advertisements[i].id}`,
					callback_data: `view_post_${advertisements[i].id}`
				}
			];

			if (advertisements[i + 1]) {
				row.push({
					text: `Пост #${advertisements[i + 1].id}`,
					callback_data: `view_post_${advertisements[i + 1].id}`
				});
			}

			inlineKeyboard.push(row);
		}
		return inlineKeyboard;
	}

	// Обработка callback_query
	private async handleCallbackQuery(query: TelegramBot.CallbackQuery, chatId: number) {
		if (query.message?.chat.id !== chatId) return;

		const data = query.data?.split('_');
		const action = data?.[0]; // Действие: view, delete или moderate
		const postId = data?.[2]; // ID поста
		const channel = data?.[4];
		const time = data?.[6];

		if (!postId) return;

		const advertisement = await this.advertisement.findOne({ where: { id: parseInt(postId) } });

		if (!advertisement) {
			await this.bot.sendMessage(chatId, 'Пост не найден.');
			return;
		}

		switch (action) {
			case 'view':
				await this.handleViewAction(chatId, advertisement);
				break;
			case 'delete':
				await this.handleDeleteAction(chatId, advertisement);
				break;
			case 'moderate':
				await this.handleModerateAction(chatId, advertisement);
				break;
			case 'channel':
				await this.handleChannelSelection(chatId, advertisement);
				break;
			case 'time':
				await this.handleTimeSelection(chatId, advertisement, channel);
				break;
			case 'selectTime':
				await this.handleSelectTimeSelection(chatId, postId, channel, time);
		}

		this.bot.answerCallbackQuery(query.id);
	}

	// Обработка действия "Просмотр"
	private async handleViewAction(chatId: number, advertisement: any) {
		const sentMessage = await this.bot.copyMessage(
			chatId,
			advertisement.sourceChatId,
			advertisement.messageId
		);

		const textButton = [
			`id: Пост #${advertisement.id}`,
			`Статус: ${advertisementStatus.find((item) => item.value === advertisement.moderationStatus).title}`,
			'',
			'Выберите действие:'
		];

		const inline_keyboard = [
			[
				{ text: 'Удалить', callback_data: `delete_post_${advertisement.id}` },
				advertisement.moderationStatus !== EAdvertisementStatus.APPROVED && {
					text: 'Отправить на модерацию',
					callback_data: `moderate_post_${advertisement.id}`
				}
			].filter(Boolean)
		];

		if (advertisement.moderationStatus === EAdvertisementStatus.APPROVED) {
			inline_keyboard[0].push({
				text: 'Выбрать время публикации',
				callback_data: `channel_post_${advertisement.id}`
			});
		}

		await this.bot.sendMessage(chatId, textButton.join('\n'), {
			reply_markup: { inline_keyboard },
			reply_to_message_id: sentMessage.message_id
		});
	}

	// Обработка действия "Удалить"
	private async handleDeleteAction(chatId: number, advertisement: Advertisement) {
		advertisement.moderationStatus = EAdvertisementStatus.ARCHIVED;
		await advertisement.save();
		await this.bot.sendMessage(chatId, `Пост #${advertisement.id} был удалён.`);
	}

	// Обработка действия "Модерация"
	private async handleModerateAction(chatId: number, advertisement: Advertisement) {
		advertisement.moderationStatus = EAdvertisementStatus.PENDING_VERIFICATION;
		await advertisement.save();
		await this.bot.sendMessage(chatId, `Пост #${advertisement.id} отправлен на модерацию.`);
	}

	private async handleChannelSelection(chatId: number, advertisement: Advertisement) {
		const channels = await this.channels.findAll();
		const result = channels.filter((channel) =>
			channel.settings?.split(',').includes(ISettingChannels.ADVERTISEMENT)
		);

		if (result.length === 0) {
			await this.bot.sendMessage(chatId, 'Нету каналов продающие рекламу');
			return;
		}

		const inlineKeyboard = this.helpersRepository.createInlineKeyboard(
			result.map((item) => ({ text: item.name, data: item.chatId.toString() })),
			3,
			`time_post_${advertisement.id}_channel`
		);

		await this.bot.sendMessage(chatId, 'Выберите канал публикации:', {
			reply_markup: { inline_keyboard: inlineKeyboard }
		});
	}

	private async handleTimeSelection(
		chatId: number,
		advertisement: Advertisement,
		channel: string
	) {
		const howDays = 2;

		if (!advertisement) {
			await this.bot.sendMessage(chatId, 'Пост не найден.');
			return;
		}

		const unavailableTimes = await this.helpersRepository.getUnavailableTimes(howDays, channel);
		const availableTimes = await this.helpersRepository.generateTimes(
			howDays,
			unavailableTimes
		);
		console.log(availableTimes);

		if (availableTimes.length === 0) {
			await this.bot.sendMessage(chatId, 'Нет доступного времени для публикации.');
			return;
		}

		// Формирование кнопок для выбора времени
		const inlineKeyboard = this.helpersRepository.createInlineKeyboard(
			availableTimes.map((item) => ({ text: item, data: item })),
			3,
			`selectTime_post_${advertisement.id}_channel_${channel}_time`
		);

		// Отправка сообщения с кнопками
		await this.bot.sendMessage(chatId, 'Выберите время публикации:', {
			reply_markup: { inline_keyboard: inlineKeyboard }
		});
	}

	private async handleSelectTimeSelection(
		chatId: number,
		postId: string,
		channel: string,
		time: string
	) {
		const advertisement = await this.advertisement.findOne({
			where: { id: postId }
		});

		let schedule: { type: ETypePostsAdvertisement; times: string[]; channel: string }[] = [];

		// Проверяем, если это строка, парсим в массив
		if (typeof advertisement.schedule === 'string') {
			schedule = JSON.parse(advertisement.schedule) || [];
		} else {
			schedule = advertisement.schedule; // Если это уже массив, просто присваиваем
		}

		const block: { type: ETypePostsAdvertisement; times: string[]; channel: string } = {
			type: ETypePostsAdvertisement.SOLO,
			times: [time],
			channel: channel
		};

		schedule.push(block); // Теперь это гарантированно массив

		advertisement.schedule = JSON.stringify(schedule);

		await advertisement.save();
		await this.bot.sendMessage(chatId, `Пост #${advertisement.id} успешно настроен.`);
	}
}

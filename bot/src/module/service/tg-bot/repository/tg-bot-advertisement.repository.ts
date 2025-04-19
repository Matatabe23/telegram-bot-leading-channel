import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';
import { Users } from 'src/module/db/models/users.repository';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { Advertisement } from 'src/module/db/models/advertisement.repository';
import { EAdvertisementStatus, ETypePostsAdvertisement, ESettingChannels } from 'src/types/types';
import { ADVERTISEMENT_STATUS, buttonText, DATA_GENERATE, priceAdvertising } from 'src/const/const';
import { HelpersRepository } from '../../helpers/helpers.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { Op } from 'sequelize';
import { RegularPublicationBotRepository } from '../../regular-publication-bot/regular-publication-bot.repository';
import { AdvertisementSchedule } from 'src/module/db/models/advertisement-schedule.repository';
import { addHours, parseISO } from 'date-fns';

@Injectable()
export class TGBotAdvertisementRepository {
	public bot: TelegramBot;
	private readonly timeout: number = 1 * 60 * 1000;
	private currentTimeout: NodeJS.Timeout;

	constructor(
		private readonly tgBotService: TGBotService,
		private readonly helpersRepository: HelpersRepository,
		private readonly regularPublicationBotRepository: RegularPublicationBotRepository,
		@InjectModel(Users)
		private readonly users: typeof Users,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@InjectModel(Channels)
		private readonly channels: typeof Channels
	) {
		this.bot = this.tgBotService.getBot();
	}

	private processedQueries: Set<string> = new Set();

	public async addAdvertisement(msg: TelegramBot.Message) {
		const user = await this.users.findOne({ where: { telegramId: msg.from?.id } });
		const chatId = msg.chat.id;

		if (!user?.isTeamMember) {
			const count = await this.advertisement.count({
				where: { sourceChatId: chatId, userId: user?.id }
			});

			if (count >= 5) {
				await this.bot.sendMessage(
					chatId,
					'Одному пользователю положено иметь только 5 постов'
				);
				return;
			}
		}

		await this.bot.sendMessage(chatId, 'Пожалуйста, отправьте рекламу в течение 1 минуты.');

		const timeoutId = setTimeout(async () => {
			this.bot.removeListener('message', onMessage);
			await this.bot.sendMessage(chatId, 'Время истекло. Реклама не была получена.');
		}, this.timeout);

		const collectedFiles: any[] = [];

		const onMessage = async (message: TelegramBot.Message) => {
			if (message.chat.id !== chatId) return;
			console.log(message);

			if (
				!message.text &&
				!message.caption &&
				!message.photo &&
				!message.video &&
				!message.document &&
				!message.voice
			) {
				return;
			}

			if (
				message.text?.startsWith(buttonText.addAdvertisements) ||
				message.text?.startsWith('/')
			) {
				clearTimeout(timeoutId);
				this.bot.removeListener('message', onMessage);
				return;
			}

			// Добавляем файлы в массив с лучшим качеством
			if (message.photo) {
				const bestPhoto = message.photo[message.photo.length - 1]; // Самое большое фото
				collectedFiles.push({ type: 'photo', file_id: bestPhoto.file_id });
			}
			if (message.video) {
				collectedFiles.push({ type: 'video', file_id: message.video.file_id });
			}
			if (message.document) {
				collectedFiles.push({ type: 'document', file_id: message.document.file_id });
			}
			if (message.voice) {
				collectedFiles.push({ type: 'voice', file_id: message.voice.file_id });
			}

			// Копируем сообщение в чат
			const sentMessage = await this.bot.copyMessage(chatId, chatId, message.message_id);

			await this.advertisement.create({
				sourceChatId: chatId,
				messageId: sentMessage.message_id,
				userId: user?.id,
				sourceMessage: JSON.stringify(message),
				messageGroupId: message?.media_group_id,
				moderationStatus: EAdvertisementStatus.CREATED
			});

			await this.bot.sendMessage(chatId, 'Реклама получена и сохранена.', {
				reply_to_message_id: sentMessage.message_id
			});
		};

		this.bot.on('message', onMessage);
	}

	// Получение списка рекламных постов пользователя
	public async viewAdvertisements(msg: TelegramBot.Message) {
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

		if (!this.processedQueries.has(chatId)) {
			const onCallbackQuery = (query: TelegramBot.CallbackQuery) => {
				this.handleCallbackQuery(query, chatId);
			};

			this.bot.on('callback_query', onCallbackQuery);

			this.processedQueries.add(chatId);

			setTimeout(() => {
				this.processedQueries.delete(chatId);
			}, 600000);
		}
	}

	// Получение пользователя по Telegram ID
	private async getUserByTelegramId(telegramId: number | undefined) {
		return this.users.findOne({ where: { telegramId } });
	}

	// Получение активных рекламных постов
	private async getActiveAdvertisements(chatId: number, userId: number) {
		return this.advertisement.findAll({
			where: {
				sourceChatId: chatId,
				userId,
				moderationStatus: { [Op.not]: EAdvertisementStatus.ARCHIVED }
			}
		});
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

	private async handleCallbackQuery(query: TelegramBot.CallbackQuery, chatId: number) {
		const queryId = query.id;

		if (this.processedQueries.has(queryId)) {
			return;
		}

		this.processedQueries.add(queryId);

		if (query.message?.chat.id !== chatId) return;

		const data = query.data?.split('_');
		const action = data?.[0];
		const postId = data?.[2];
		const channel = data?.[4];
		const time = data?.[6];

		if (!postId) return;

		const advertisement = await this.advertisement.findOne({
			where: { id: parseInt(postId) },
			include: [{ model: AdvertisementSchedule }]
		});

		const cleanData = advertisement ? advertisement.get({ plain: true }) : null;

		if (!cleanData) {
			await this.bot.sendMessage(chatId, 'Пост не найден.');
			return;
		}

		switch (action) {
			case 'view':
				await this.handleViewAction(chatId, cleanData);
				break;
			case 'delete':
				await this.handleDeleteAction(chatId, cleanData);
				break;
			case 'moderate':
				await this.handleModerateAction(chatId, advertisement);
				break;
			case 'channel':
				await this.handleChannelSelection(chatId, cleanData);
				break;
			case 'time':
				await this.handleTimeSelection(chatId, cleanData, channel);
				break;
			case 'selectTime':
				await this.handleSelectTimeSelection(chatId, postId, time, channel);
				break;
			case 'clearTime':
				await this.handleClearTimeAction(chatId, cleanData);
		}

		this.bot.answerCallbackQuery(query.id);

		setTimeout(() => {
			this.processedQueries.delete(queryId);
		}, 100000);
	}

	// Обработка действия "Просмотр"
	private async handleViewAction(chatId: number, advertisement: Advertisement) {
		const sentMessage = await this.bot.copyMessage(
			chatId,
			advertisement.sourceChatId,
			advertisement.messageId
		);

		const channel = await this.channels.findAll();
		const publicationTimes = await Promise.all(
			advertisement?.schedules.map((item) => {
				const matchedChannel = channel.find((chan) => item.sourceChatId === chan.chatId);
				return `(${item.publicationTime} - ${matchedChannel?.name || 'Неизвестный канал'})`;
			}) || []
		);

		const textButton = [
			`id: Пост #${advertisement.id}`,
			`Статус: ${ADVERTISEMENT_STATUS.find((item) => item.value === advertisement.moderationStatus).title}`,
			publicationTimes.length > 0 ? publicationTimes.join(', ') : null,
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
			].filter(Boolean),
			[]
		];

		if (advertisement.moderationStatus === EAdvertisementStatus.APPROVED) {
			inline_keyboard[0].push({
				text: 'Выбрать время публикации',
				callback_data: `channel_post_${advertisement.id}`
			});
		}

		if (advertisement.schedules?.length > 0) {
			inline_keyboard[1].push({
				text: 'Очистить время публикации',
				callback_data: `clearTime_post_${advertisement.id}`
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
		await this.regularPublicationBotRepository.scheduleAdExecution();
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
			channel.settings?.split(',').includes(ESettingChannels.ADVERTISEMENT)
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
		console.log(channel);
		if (!advertisement) {
			await this.bot.sendMessage(chatId, 'Пост не найден.');
			return;
		}

		const unavailableTimes = await this.helpersRepository.getUnavailableTimes(
			DATA_GENERATE,
			channel
		);

		const availableTimes = await this.helpersRepository.generateTimes(
			DATA_GENERATE,
			unavailableTimes as any
		);

		if (availableTimes.length === 0) {
			await this.bot.sendMessage(chatId, 'Нет доступного времени для публикации.');
			return;
		}

		const inlineKeyboard = this.helpersRepository.createInlineKeyboard(
			availableTimes.map((item) => ({ text: item, data: item })),
			3,
			`selectTime_post_${advertisement.id}_channel_${channel}_time`
		);

		await this.bot.sendMessage(chatId, 'Выберите время публикации:', {
			reply_markup: { inline_keyboard: inlineKeyboard }
		});
	}

	private async handleSelectTimeSelection(
		chatId: number,
		postId: string,
		time: string,
		channelId: string
	) {
		const advertisement = await this.advertisement.findOne({
			where: { id: postId },
			include: [{ model: AdvertisementSchedule }]
		});

		if (!advertisement) {
			await this.bot.sendMessage(chatId, `Объявление не найдено.`);
			return;
		}

		const user = await this.users.findOne({ where: { telegramId: chatId } });

		if (!user || user.coin < priceAdvertising) {
			await this.bot.sendMessage(chatId, `На вашем балансе недостаточно coin.`);
			return;
		}

		const adListUser = await this.advertisement.findAll({
			where: {
				sourceChatId: chatId,
				moderationStatus: { [Op.not]: EAdvertisementStatus.ARCHIVED }
			},
			include: [{ model: AdvertisementSchedule }]
		});

		let total = 0;
		adListUser.forEach((ad) => {
			if (ad.schedules) {
				ad.schedules.forEach((schedule) => {
					if (schedule.publicationType !== ETypePostsAdvertisement.RANDOM) {
						total++;
					}
				});
			}
		});

		const totalSum = total * priceAdvertising + priceAdvertising;
		if (totalSum > user.coin) {
			await this.bot.sendMessage(chatId, `На вашем балансе недостаточно coin.`);
			return;
		}

		// Преобразуем время в Date
		const publicationDate = parseISO(time);

		// Создаем новую запись в AdvertisementSchedule
		await AdvertisementSchedule.create({
			advertisementId: advertisement.id,
			publicationType: ETypePostsAdvertisement.SOLO,
			publicationTime: publicationDate,
			sourceChatId: channelId,
			deleteTime: null
		});

		await this.bot.sendMessage(chatId, `Пост #${advertisement.id} успешно настроен.`);
		await this.regularPublicationBotRepository.scheduleAdExecution();
	}

	private async handleClearTimeAction(chatId: number, advertisement: Advertisement) {
		await AdvertisementSchedule.destroy({
			where: { advertisementId: advertisement.id }
		});

		await this.bot.sendMessage(chatId, 'Все запланированные времена успешно очищены.');
		await this.regularPublicationBotRepository.scheduleAdExecution();
	}

	async publishAdvertisementFromChannel(advertisement: any) {
		if (advertisement.moderationStatus !== EAdvertisementStatus.APPROVED) return;

		const user = await this.users.findOne({ where: { id: advertisement.userId } });

		user.coin -= priceAdvertising;
		await user.save();

		const message = await this.bot.copyMessage(
			advertisement.schedule.channel,
			advertisement.sourceChatId,
			advertisement.messageId
		);

		const advertisementDb = await this.advertisement.findOne({
			where: { id: advertisement.id },
			include: [
				{
					model: AdvertisementSchedule
				}
			]
		});

		// if (advertisement.schedule.type === ETypePostsAdvertisement.SOLO) {
		// 	const oldSchedule = JSON.parse(advertisementDb.dataValues.schedule || '[]');
		// 	const newSchedule = oldSchedule.filter(
		// 		(item) =>
		// 			!(
		// 				item.times === advertisement.schedule.times &&
		// 				item.channel === advertisement.schedule.channel
		// 			)
		// 	);

		// 	advertisementDb.schedule = JSON.stringify(newSchedule);
		// }

		// const newDeleteMessageInfo = [
		// 	...JSON.parse(advertisementDb.dataValues.deleteMessageInfo || '[]'),
		// 	{
		// 		messageId: message.message_id,
		// 		channel: advertisement.schedule.channel,
		// 		time: ETypePostsAdvertisement.SOLO
		// 			? advertisement.schedule.times
		// 			: new Date()
		// 					.toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' })
		// 					.replace('T', ' ')
		// 	}
		// ];

		// advertisementDb.deleteMessageInfo = JSON.stringify(newDeleteMessageInfo);
		// advertisementDb.save();
	}

	async deleteAdvertisementFromChannel(value: { channel: string; messageId: number }) {
		// try {
		// 	await this.bot.deleteMessage(value.channel, value.messageId);
		// } catch (error) {
		// 	console.error(error);
		// }
	}
}

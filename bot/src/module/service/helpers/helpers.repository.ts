import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EPermissions } from 'src/types/types';
import { Payments } from 'src/module/db/models/payments.repository';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';
import { Advertisement } from 'src/module/db/models/advertisement.repository';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { Tags } from 'src/module/db/models/tags.repository';
import { PostTags } from 'src/module/db/models/post-tags.repository';
import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { AdvertisementSchedule } from 'src/module/db/models/advertisement-schedule.repository';
import { Op } from 'sequelize';
import { DATA_GENERATE } from 'src/const/const';

@Injectable()
export class HelpersRepository {
	constructor(
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings,
		@InjectModel(Payments)
		private readonly payments: typeof Payments,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Tags)
		private readonly tags: typeof Tags,
		@InjectModel(PostTags)
		private readonly postTags: typeof PostTags,
		@InjectModel(DataBasePosts)
		private readonly dataBasePosts: typeof DataBasePosts
	) {}

	async checkPermissions(role: string, permission: EPermissions) {
		const requiredPermissions = await this.rolesSettings.findOne({ where: { name: role } });
		if (requiredPermissions?.permissions) {
			return requiredPermissions?.permissions.includes(permission);
		}
		return false;
	}

	async savePaymentData(payment: {
		userId: number;
		paymentId: string;
		status: string;
		provider: string;
		amount: number;
		currency: string;
		paymentData: any;
	}) {
		try {
			await this.payments.create({
				userId: payment.userId,
				paymentId: payment.paymentId,
				status: payment.status,
				amount: payment.amount,
				provider: payment.provider,
				currency: payment.currency,
				paymentData: payment.paymentData,
				createdAt: new Date()
			});
		} catch (error) {
			console.error('Ошибка при сохранении данных о платеже:', error);
		}
	}

	async getUnavailableTimes(daysCount: number, channel: string) {
		const now = new Date();
		const twoDaysLater = new Date();
		twoDaysLater.setDate(now.getDate() + DATA_GENERATE);

		const advertisements = await this.advertisement.findAll({
			include: [
				{
					model: AdvertisementSchedule,
					where: {
						publicationTime: {
							[Op.between]: [now, twoDaysLater]
						}
					}
				}
			]
		});

		const advertisementTimes = advertisements.flatMap((ad) => {
			return ad
				.get({ plain: true })
				.schedules.filter((item) => item.sourceChatId.toString() === channel)
				.map((item) => item.publicationTime); // Извлекаем только publicationTime
		});

		const regularTimes = await this.regularPublicationTime.findAll({
			attributes: ['hour', 'minute'],
			include: [
				{
					model: Channels,
					attributes: [],
					where: {
						chatId: channel
					}
				}
			]
		});

		const regularTimesFormatted = regularTimes.flatMap((time) => {
			const currentDate = new Date();
			const formattedTimes = [];

			for (let i = 0; i < daysCount; i++) {
				const date = new Date(currentDate);
				date.setDate(currentDate.getDate() + i);

				// Устанавливаем время
				date.setHours(Number(time.hour));
				date.setMinutes(Number(time.minute));
				date.setSeconds(0);
				date.setMilliseconds(0);

				// Добавляем объект Date в массив
				formattedTimes.push(date);
			}

			return formattedTimes;
		});

		// Объединяем все занятые часы
		return [...advertisementTimes, ...regularTimesFormatted].filter((item) => item);
	}

	generateTimes(days: number, unavailableTimes: Date[]): string[] {
		const availableTimes: string[] = [];
		const now = new Date();

		const moscowOffset = 3 * 60 * 60 * 1000;
		const moscowNow = new Date(now.getTime() + moscowOffset);

		// Преобразуем даты в формат 'YYYY-MM-DD HH:mm'
		const normalizedUnavailableTimes = unavailableTimes.map((time) => {
			const year = time.getFullYear();
			const month = String(time.getMonth() + 1).padStart(2, '0');
			const day = String(time.getDate()).padStart(2, '0');
			const hour = String(time.getHours()).padStart(2, '0');
			const minute = String(time.getMinutes()).padStart(2, '0');

			return `${year}-${month}-${day} ${hour}:${minute}`;
		});

		for (let day = 0; day < days; day++) {
			const date = new Date(moscowNow);
			date.setDate(moscowNow.getDate() + day);
			const formattedDate = date.toISOString().slice(0, 10);

			for (let hour = 0; hour < 24; hour++) {
				date.setUTCHours(hour, 0, 0, 0);

				if (date.getTime() < moscowNow.getTime()) {
					continue;
				}

				const timeString = date.toISOString().slice(11, 16);
				const fullDateTimeString = `${formattedDate} ${timeString}`;

				if (!normalizedUnavailableTimes.includes(fullDateTimeString)) {
					availableTimes.push(fullDateTimeString);
				}
			}
		}

		return availableTimes;
	}

	createInlineKeyboard(
		buttonsData: { text: string; data: string }[],
		maxButtonsPerRow: number,
		callbackPrefix: string
	): any[] {
		const inlineKeyboard: any[] = [];
		let row: any[] = [];

		buttonsData.forEach((button, index) => {
			row.push({
				text: button.text,
				callback_data: `${callbackPrefix}_${button.data}`
			});

			if ((index + 1) % maxButtonsPerRow === 0 || index === buttonsData.length - 1) {
				inlineKeyboard.push(row);
				row = [];
			}
		});

		return inlineKeyboard;
	}

	async createTags(tags: string[], postId?: number) {
		if (tags && tags.length > 0) {
			const tagInstances = await Promise.all(
				tags.map(async (tagName) => {
					let tag = await this.tags.findOne({ where: { name: tagName } });
					if (!tag) {
						tag = await this.tags.create({ name: tagName });
					}
					return tag;
				})
			);

			// Вставляем связи в таблицу PostTags
			if (postId) {
				await Promise.all(
					tagInstances.map(async (tag) => {
						await this.postTags.create({
							postId: postId,
							tagId: tag.id
						});
					})
				);
			}
		}
	}

	async getTagsByPostId(postId: number): Promise<string> {
		const post = await this.dataBasePosts.findByPk(postId, {
			include: {
				model: this.tags,
				through: { attributes: [] } // Убираем промежуточные данные
			}
		});

		if (!post) return '';

		return post.tags.map((tag) => tag.name).join(', ');
	}
}

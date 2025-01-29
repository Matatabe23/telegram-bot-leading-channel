import { Advertisement } from './../../db/models/advertisement.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment-timezone';
import * as schedule from 'node-schedule';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { TGBotPostsRepository } from '../tg-bot/repository/tg-bot-posts.repository';
import { Op } from 'sequelize';
import { EAdvertisementStatus } from 'src/types/types';
import { TGBotAdvertisementRepository } from '../tg-bot/repository/tg-bot-advertisement.repository';
import { Users } from 'src/module/db/models/users.repository';

@Injectable()
export class RegularPublicationBotRepository implements OnModuleInit {
	private jobs: any[] = [];
	private adJobs: any[] = [];

	constructor(
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@InjectModel(Users)
		private readonly users: typeof Users,
		private readonly tGBotPostsRepository: TGBotPostsRepository,
		private readonly tGBotAdvertisementRepository: TGBotAdvertisementRepository
	) {}

	async onModuleInit() {
		moment.tz.setDefault('Europe/Moscow');
		await this.scheduleFunctionExecution();
		await this.scheduleAdExecution();

		schedule.scheduleJob('0 0 * * *', async () => {
			moment.tz.setDefault('Europe/Moscow');
			await this.scheduleFunctionExecution();
			await this.scheduleAdExecution();
		});
	}

	//Публикация постов
	async scheduleFunctionExecution() {
		const times = await this.getPublishTimesFromDB();
		const scheduleTimes = times.map((time) => {
			const moscowTime = moment()
				.hour(time.hour)
				.minute(time.minute)
				.second(0)
				.millisecond(0);
			return { time: moscowTime.toDate(), chatId: time.chatId };
		});

		this.jobs.forEach((job) => schedule.cancelJob(job));
		this.jobs = [];

		scheduleTimes.forEach((time) => {
			const job = schedule.scheduleJob(time.time, () => {
				this.tGBotPostsRepository.sendMessageAtScheduledTime(time);
			});
			if (job) {
				this.jobs.push(job);
			}
		});
	}

	//Публикация рекламы
	async scheduleAdExecution() {
		const advertisements = await this.getTodayAdvertisements();

		const scheduleTimes = advertisements
			.flatMap((ad) => {
				const schedule = ad.schedule ? JSON.parse(ad.schedule) : null;

				if (!Array.isArray(schedule)) return []; // Пропускаем, если schedule не массив

				return schedule
					.filter((item) => {
						const parsedTime = moment(item.times, 'YYYY-MM-DD HH:mm');
						return parsedTime.isSame(moment(), 'day'); // Фильтруем только сегодняшние даты
					})
					.map((item) => {
						const parsedTime = moment(item.times, 'YYYY-MM-DD HH:mm');
						const hours = parsedTime.hour();
						const minutes = parsedTime.minute();

						// Преобразуем время в МСК и прибавляем 3 часа
						const moscowTime = moment()
							.hour(hours)
							.minute(minutes)
							.second(0)
							.millisecond(0);

						return {
							time: moscowTime.toDate(),
							advertisement: { ...ad.dataValues, schedule: item }
						};
					});
			})
			.filter((item) => item !== null);

		// Отменяем предыдущие задания
		this.adJobs.forEach((job) => schedule.cancelJob(job));
		this.adJobs = [];

		scheduleTimes.forEach((item) => {
			const job = schedule.scheduleJob(item.time, () => {
				this.tGBotAdvertisementRepository.publishAdvertisementFromChannel(
					item.advertisement
				);
			});
			if (job) {
				this.adJobs.push(job);
			}
		});
	}

	private async getPublishTimesFromDB(): Promise<any> {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				try {
					const allRegularPublicationTimes = await this.regularPublicationTime.findAll({
						include: [{ model: Channels }]
					});
					resolve(
						allRegularPublicationTimes.map((time: any) => ({
							hour: time.hour,
							minute: time.minute,
							...time.channel.dataValues
						}))
					);
				} catch (error) {
					reject(error);
				}
			}, 5000);
		});
	}

	private async getTodayAdvertisements() {
		const today = new Date();
		today.setHours(today.getHours() + 3);
		const todayDate = today.toISOString().split('T')[0];

		const advertisements = await this.advertisement.findAll({
			where: {
				schedule: {
					[Op.ne]: null
				},
				moderationStatus: EAdvertisementStatus.APPROVED
			}
		});

		return advertisements.filter((ad) => {
			try {
				const schedule = JSON.parse(ad.schedule);

				return schedule.some((entry) => {
					const date = new Date(`${entry.times} UTC`);

					return date.toISOString().split('T')[0] === todayDate;
				});
			} catch (error) {
				console.error(`Ошибка парсинга schedule: ${error.message}`);
				return false;
			}
		});
	}
}

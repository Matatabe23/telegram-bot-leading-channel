import { Advertisement } from './../../db/models/advertisement.repository';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment-timezone';
import * as schedule from 'node-schedule';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { TGBotPostsRepository } from '../tg-bot/repository/tg-bot-posts.repository';
import { Op } from 'sequelize';
import { EAdvertisementStatus, ETypePostsAdvertisement } from 'src/types/types';
import { TGBotAdvertisementRepository } from '../tg-bot/repository/tg-bot-advertisement.repository';

@Injectable()
export class RegularPublicationBotRepository implements OnModuleInit {
	private jobs: any[] = [];
	private adJobs: any[] = [];

	constructor(
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@Inject(forwardRef(() => TGBotPostsRepository))
		private readonly tGBotPostsRepository: TGBotPostsRepository,
		@Inject(forwardRef(() => TGBotAdvertisementRepository))
		private readonly tGBotAdvertisementRepository: TGBotAdvertisementRepository
	) {}

	async onModuleInit() {
		moment.tz.setDefault('Europe/Moscow');
		await this.scheduleFunctionExecution();
		await this.scheduleAdExecution();
		await this.scheduleWeeklyExecution();

		schedule.scheduleJob('0 0 * * *', async () => {
			moment.tz.setDefault('Europe/Moscow');
			await this.scheduleFunctionExecution();
			await this.scheduleAdExecution();
		});

		schedule.scheduleJob('0 0 * * 0', async () => {
			moment.tz.setDefault('Europe/Moscow');
			await this.scheduleWeeklyExecution();
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
		const advertisements = await this.getAdvertisements('daily');

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
			console.log(item);
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

	private async scheduleWeeklyExecution() {
		const getRandomDayAndTime = () => {
			const randomDayOffset = Math.floor(Math.random() * 7); // Случайный день в пределах недели
			const randomHour = Math.floor(Math.random() * 24); // Случайный час
			const randomMinute = Math.floor(Math.random() * 60); // Случайная минута

			return moment()
				.add(randomDayOffset, 'days')
				.hour(randomHour)
				.minute(randomMinute)
				.second(0)
				.millisecond(0);
		};

		const advertisements = await this.getAdvertisements('weekly');

		advertisements.forEach((item) => {
			JSON.parse(item.schedule).forEach((element) => {
				const nextExecutionTime = getRandomDayAndTime().toDate();

				const newAdvertisements = {
					...item.dataValues,
					schedule: element
				};

				if (newAdvertisements.schedule.type !== ETypePostsAdvertisement.RANDOM) return;

				const job = schedule.scheduleJob(nextExecutionTime, () => {
					this.tGBotAdvertisementRepository.publishAdvertisementFromChannel(
						newAdvertisements
					);
				});
				if (job) {
					this.adJobs.push(job);
				}
			});
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

	private async getAdvertisements(periodType: 'daily' | 'weekly') {
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

		try {
			return advertisements.filter((ad) => {
				const schedule = JSON.parse(ad.schedule);

				if (periodType === 'weekly') {
					return (
						Array.isArray(schedule) &&
						schedule.some((entry) => entry.type === ETypePostsAdvertisement.RANDOM)
					);
				} else if (periodType === 'daily') {
					return schedule.some((entry) => {
						const date = new Date(`${entry.times} UTC`);

						return date.toISOString().split('T')[0] === todayDate;
					});
				}
			});
		} catch (e) {
			console.error(`Ошибка получения объявлений: ${e.message}`);
		}
	}
}

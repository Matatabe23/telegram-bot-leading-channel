import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment-timezone';
import * as schedule from 'node-schedule';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { TGBotPostsRepository } from '../tg-bot/repository/tg-bot-posts.repository';

@Injectable()
export class RegularPublicationBotRepository implements OnModuleInit {
	private jobs: any[] = [];
	private adJobs: any[] = [];

	constructor(
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@Inject(forwardRef(() => TGBotPostsRepository))
		private readonly tGBotPostsRepository: TGBotPostsRepository
	) {}

	async onModuleInit() {
		moment.tz.setDefault('Europe/Moscow');
		await this.scheduleFunctionExecution();

		// Каждый день в 00:00
		schedule.scheduleJob('0 0 * * *', async () => {
			moment.tz.setDefault('Europe/Moscow');
			await this.scheduleFunctionExecution();
		});

		// Каждое воскресенье в 00:00
		schedule.scheduleJob('0 0 * * 0', async () => {
			moment.tz.setDefault('Europe/Moscow');
		});
	}

	//Публикация постов
	async scheduleFunctionExecution() {
		const times = await this.getPublishTimesFromDB();
		const scheduleTimes = times.map((time, index) => {
			const moscowTime = moment()
				.hour(time.hour)
				.minute(time.minute)
				.second(0)
				.millisecond(index);
			return { time: moscowTime.toDate(), chatId: time.chatId };
		});

		this.jobs.forEach((job) => schedule.cancelJob(job));
		this.jobs = [];

		scheduleTimes.forEach((time, index) => {
			const job = schedule.scheduleJob(time.time, () => {
				setTimeout(() => {
					this.tGBotPostsRepository.sendMessageAtScheduledTime(time);
				}, 1000 + index);
			});
			if (job) {
				this.jobs.push(job);
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
}

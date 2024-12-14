import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegularPublicationBotRepository } from 'src/module/service/regular-publication-bot/regular-publication-bot.repository';

import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { Sequelize } from 'sequelize';

@Injectable()
export class SettingsService {
	constructor(
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		private readonly regularPublicationBotRepository: RegularPublicationBotRepository
	) {}

	async addingPublicationTime(hour: string, minute: string, channelId: string) {
		if (hour === '' || isNaN(Number(hour)) || Number(hour) < 0 || Number(hour) > 24) {
			throw new NotFoundException('Некорректные данные');
		}
		if (minute === '' || isNaN(Number(minute)) || Number(minute) < 0 || Number(minute) > 59) {
			throw new NotFoundException('Некорректные данные');
		}
		if (!channelId) {
			throw new NotFoundException('Некорректный айди чата');
		}

		await this.regularPublicationTime.create({
			hour: hour,
			minute: minute,
			channelId: channelId
		});

		this.regularPublicationBotRepository.scheduleFunctionExecution();

		return 'Успешное добавление!';
	}

	async getListRegularPublicationTimes(channelId: string) {
		const list = await this.regularPublicationTime.findAll({
			where: { channelId: channelId },
			order: [[Sequelize.literal('CAST(hour AS UNSIGNED)'), 'ASC']]
		});
		return list;
	}

	async deleteItemPublicationTimes(id: string) {
		const times = await this.regularPublicationTime.findByPk(id);
		if (!times) {
			throw new NotFoundException('Некорректные данные');
		}

		await this.regularPublicationTime.destroy({ where: { id } });
		this.regularPublicationBotRepository.scheduleFunctionExecution();

		return 'Успешное удаление';
	}

	async addingNewChannels(name: string, chatId: string) {
		if (!name || !chatId) throw new NotFoundException('Некорректные данные');

		await this.channels.create({
			name: name,
			chatId: chatId,
			settings: ''
		});

		return 'Успешное добавление!';
	}

	async getListChannel() {
		const list = await this.channels.findAll({
			include: [
				{
					model: RegularPublicationTime
				}
			]
		});
		return list;
	}

	async deleteChannel(id: string) {
		const times = await this.channels.findByPk(id);
		if (!times) {
			throw new NotFoundException('Некорректные данные');
		}

		await this.channels.destroy({ where: { id } });

		return 'Успешное удаление';
	}

	async editChannel(id: number, settings: string[]) {
		const settingsString = settings.join(',');

		await this.channels.update({ settings: settingsString }, { where: { id } });

		return 'Успешное обновление';
	}
}

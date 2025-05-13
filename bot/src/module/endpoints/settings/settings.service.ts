import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegularPublicationBotRepository } from 'src/module/service/regular-publication-bot/regular-publication-bot.repository';

import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Channels } from 'src/module/db/models/channels.repository';

@Injectable()
export class SettingsService {
	constructor(
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		private readonly regularPublicationBotRepository: RegularPublicationBotRepository
	) {}

	async channelCreate(name: string, chatId: string) {
		const channel = await this.channels.create({
			name: name,
			chatId: chatId,
			settings: ''
		});

		return {
			message: 'Успешное добавление!',
			data: channel
		};
	}

	async getListChannel() {
		const list = await this.channels.findAll({
			include: [
				{
					model: RegularPublicationTime
				}
			]
		});
		return {
			message: 'Успешное получение списка',
			data: list
		};
	}

	async getChannel(id: number) {
		const list = await this.channels.findOne({
			where: { id: id },
			include: [
				{
					model: RegularPublicationTime
				}
			]
		});
		return {
			message: 'Канал успешно получен',
			data: list
		};
	}

	async updateChannel(id: number, data: any) {
		const channel = await this.channels.findByPk(id);
		if (!channel) {
			throw new NotFoundException('Канал не найден');
		}

		const updateData: Record<string, any> = {};
		for (const key in data) {
			if (data[key] !== undefined && data[key] !== null) {
				updateData[key] = data[key];
			}
		}

		if (Object.keys(updateData).length > 0) {
			await this.channels.update(updateData, { where: { id } });
		}

		if (Array.isArray(data.regularPublicationTimes)) {
			await this.regularPublicationTime.destroy({ where: { channelId: id } });

			for (const time of data.regularPublicationTimes) {
				await this.regularPublicationTime.create({
					channelId: id,
					hour: time.hour,
					minute: time.minute
				});
			}
		}

		this.regularPublicationBotRepository.scheduleFunctionExecution();

		const updated = await this.channels.findOne({
			where: { id },
			include: [{ model: RegularPublicationTime }]
		});

		return {
			message: 'Канал и расписание успешно обновлены',
			data: updated
		};
	}

	async deleteChannel(id: string) {
		const channel = await this.channels.findByPk(id);
		if (!channel) {
			throw new NotFoundException('Канал не найден');
		}

		await this.regularPublicationTime.destroy({ where: { channelId: id } });
		await this.channels.destroy({ where: { id } });

		return { message: 'Канал и связанные записи успешно удалены' };
	}

	async deleteTime(id: string) {
		const times = await this.regularPublicationTime.findByPk(id);
		if (!times) {
			throw new NotFoundException('Некорректные данные');
		}

		await this.regularPublicationTime.destroy({ where: { id } });
		this.regularPublicationBotRepository.scheduleFunctionExecution();

		return { message: 'Время успешно удалено' };
	}
}

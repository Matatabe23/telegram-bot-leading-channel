import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Advertisement } from 'src/module/db/models/advertisement.repository';
import { Users } from 'src/module/db/models/users.repository';
import { AdvertisementDto } from './dto/advertisement.dto';

@Injectable()
export class AdvertisementService {
	constructor(
		@InjectModel(Advertisement)
		private readonly advertisement: typeof Advertisement,
		@InjectModel(Users)
		private readonly users: typeof Users
	) {}

	// Получения списка рекламы
	async getAdvertisements(
		page: number = 1,
		perPage: number = 10,
		sortBy: string,
		sortOrder: 'ASC' | 'DESC'
	) {
		try {
			const offset = (page - 1) * perPage;

			const { rows: users, count: totalItems } = await this.advertisement.findAndCountAll({
				offset,
				limit: perPage,
				order: [[sortBy, sortOrder]],
				include: [
					{
						model: Users,
						as: 'user'
					}
				]
			});

			return {
				pagination: {
					count: totalItems,
					currentPage: page,
					perPage
				},
				data: users,
				message: 'Успешное получение постов'
			};
		} catch (error) {
			return 'Не удалось получить список рекламы';
		}
	}

	async updateAdvertisement(advertisement: AdvertisementDto) {
		try {
			const oldAdvertisement = await this.advertisement.findOne({
				where: { id: advertisement.id }
			});

			if (!oldAdvertisement) {
				throw new Error('Реклама не найдена');
			}

			Object.assign(oldAdvertisement, advertisement);
			await oldAdvertisement.save();

			return {
				pagination: null,
				data: oldAdvertisement,
				message: 'Успешное редактирование рекламы'
			};
		} catch (error) {
			console.error('Ошибка при обновлении рекламы:', error);
			throw new Error(error.message || 'Не удалось обновить рекламу');
		}
	}
}

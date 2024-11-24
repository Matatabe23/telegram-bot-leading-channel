import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';

@Injectable()
export class RolesService {
	constructor(
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings
	) {}

	// Создание новой роли
	async createNewRole(nameRole: string) {
		try {
			await this.rolesSettings.create({
				name: nameRole
			});
			return 'Роль создана';
		} catch (error) {
			console.error('Ошибка при создании роли:', error);
			throw new Error('Не удалось создать роль');
		}
	}

	// Получение списка всех ролей
	async getRoles() {
		try {
			return await this.rolesSettings.findAll();
		} catch (error) {
			console.error('Ошибка при получении ролей:', error);
			throw new Error('Не удалось получить роли');
		}
	}

	// Удаление роли по ID
	async deleteRole(id: number) {
		try {
			const deletedCount = await this.rolesSettings.destroy({ where: { id } });
			if (deletedCount === 0) {
				throw new Error('Роль не найдена');
			}
			return 'Роль удалена';
		} catch (error) {
			console.error('Ошибка при удалении роли:', error);
			throw new Error(error.message || 'Не удалось удалить роль');
		}
	}
}

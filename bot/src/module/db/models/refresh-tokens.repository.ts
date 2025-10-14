import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Users } from './users.repository';

@Table
export class RefreshTokens extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number; // Уникальный идентификатор токена

	@ForeignKey(() => Users)
	@Column
	userId: number; // ID пользователя (внешний ключ)

	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	token: string;

	@Column({ allowNull: true })
	deviceName: string; // Название устройства

	@Column({ allowNull: true })
	deviceType: string; // Тип устройства (mobile, desktop, web и т.д.)

	@Column({ allowNull: true })
	userAgent: string; // User Agent браузера/приложения

	@Column({ allowNull: true })
	ipAddress: string; // IP адрес

	@Column({ allowNull: true })
	location: string; // Местоположение (город, страна или координаты)

	@Column({ allowNull: true })
	latitude: number; // Широта

	@Column({ allowNull: true })
	longitude: number; // Долгота

	@Column({ allowNull: true })
	country: string; // Страна

	@Column({ allowNull: true })
	city: string; // Город

	@Column({ allowNull: true })
	region: string; // Регион

	@Column({ allowNull: true })
	timezone: string; // Часовой пояс

	@Column({ defaultValue: false })
	isRevoked: boolean; // Отозван ли токен

	@Column({ allowNull: true })
	revokedAt: Date; // Время отзыва токена

	@Column({ allowNull: true })
	revokedReason: string; // Причина отзыва токена

	@Column({ allowNull: true })
	lastUsedAt: Date; // Время последнего использования

	@Column({ defaultValue: 0 })
	usageCount: number; // Количество использований токена

	@Column({ allowNull: true })
	expiresAt: Date; // Время истечения токена

	@Column({ allowNull: true })
	createdAt: Date; // Время создания записи

	@Column({ allowNull: true })
	updatedAt: Date; // Время последнего обновления записи

	@Column({ allowNull: true })
	metadata: string; // JSON строка с дополнительными данными токена

	// Связь с пользователем
	@BelongsTo(() => Users)
	user: Users;
}

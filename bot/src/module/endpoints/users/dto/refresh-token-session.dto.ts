import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenSessionDto {
	@ApiProperty({ example: 1, description: 'Уникальный идентификатор сессии' })
	id: number;

	@ApiProperty({ example: 12, description: 'ID пользователя, к которому принадлежит сессия' })
	userId: number;

	@ApiProperty({ example: 'iPhone 14 Pro', description: 'Название устройства', nullable: true })
	deviceName?: string;

	@ApiProperty({
		example: 'mobile',
		description: 'Тип устройства (mobile, desktop, web)',
		nullable: true
	})
	deviceType?: string;

	@ApiProperty({
		example: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...',
		description: 'User Agent браузера или приложения',
		nullable: true
	})
	userAgent?: string;

	@ApiProperty({ example: '192.168.0.10', description: 'IP адрес', nullable: true })
	ipAddress?: string;

	@ApiProperty({ example: 'Москва, Россия', description: 'Местоположение', nullable: true })
	location?: string;

	@ApiProperty({ example: 55.7558, description: 'Широта', nullable: true })
	latitude?: number;

	@ApiProperty({ example: 37.6176, description: 'Долгота', nullable: true })
	longitude?: number;

	@ApiProperty({ example: 'Россия', description: 'Страна', nullable: true })
	country?: string;

	@ApiProperty({ example: 'Москва', description: 'Город', nullable: true })
	city?: string;

	@ApiProperty({ example: 'Московская область', description: 'Регион', nullable: true })
	region?: string;

	@ApiProperty({ example: 'Europe/Moscow', description: 'Часовой пояс', nullable: true })
	timezone?: string;

	@ApiProperty({ example: false, description: 'Отозвана ли сессия' })
	isRevoked: boolean;

	@ApiProperty({
		example: '2025-10-16T12:30:00.000Z',
		description: 'Дата и время отзыва токена',
		nullable: true
	})
	revokedAt?: Date;

	@ApiProperty({
		example: 'Пользователь вышел из системы',
		description: 'Причина отзыва',
		nullable: true
	})
	revokedReason?: string;

	@ApiProperty({
		example: '2025-10-16T13:45:00.000Z',
		description: 'Дата и время последнего использования',
		nullable: true
	})
	lastUsedAt?: Date;

	@ApiProperty({ example: 3, description: 'Количество использований токена' })
	usageCount: number;

	@ApiProperty({
		example: '2025-11-16T12:30:00.000Z',
		description: 'Дата и время истечения токена',
		nullable: true
	})
	expiresAt?: Date;

	@ApiProperty({
		example: '2025-10-15T12:30:00.000Z',
		description: 'Дата и время создания записи',
		nullable: true
	})
	createdAt?: Date;

	@ApiProperty({
		example: '2025-10-16T12:35:00.000Z',
		description: 'Дата и время последнего обновления записи',
		nullable: true
	})
	updatedAt?: Date;

	@ApiProperty({
		example: '{"browserLanguage":"ru-RU"}',
		description: 'Дополнительные данные о сессии в формате JSON строки',
		nullable: true
	})
	metadata?: string;
}

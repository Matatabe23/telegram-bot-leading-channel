import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/module/db/models/users.repository';
import { UsersDto } from './dto/user.dto';
import { TokenRepository } from 'src/module/service/token/token.repository';
import { TGBotUsersRepository } from 'src/module/service/tg-bot/repository/tg-bot-users.repository';
import { Op } from 'sequelize';
import { RefreshTokens } from 'src/module/db/models/refresh-tokens.repository';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(Users)
		private readonly usersRepository: typeof Users,
		@InjectModel(RefreshTokens)
		private readonly refreshTokens: typeof RefreshTokens,
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings,
		private readonly tokenRepository: TokenRepository,
		private readonly tGBotUsersRepository: TGBotUsersRepository
	) {}

	async login(loginDto: LoginUserDto, req?: Request) {
		const { name, deviceInfo } = loginDto;

		const lowerName = name.toLowerCase();
		const user = await this.usersRepository.findOne({
			where: { name: lowerName }
		});

		if (!user) throw new NotFoundException('Пользователь не найден');
		if (!user.isTeamMember) throw new NotFoundException('Вы не участник команды');

		const isVerification = await this.tGBotUsersRepository.requestLoginConfirmation(
			Number(user.telegramId)
		);
		if (!isVerification) throw new NotFoundException('Отказано во входе');

		const resultDto = new UsersDto(user.dataValues);

		const payload = {
			id: user.id,
			roles: user.role
		};
		const accessToken = this.tokenRepository.sign(payload, {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: '10m'
		});
		const refreshToken = this.tokenRepository.sign(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: '30d'
		});

		const finalDeviceInfo = {
			deviceName: deviceInfo?.deviceName || 'unknown',
			deviceType: deviceInfo?.deviceType || 'web',
			userAgent: deviceInfo?.userAgent || req?.headers['user-agent'] || 'unknown',
			ipAddress:
				deviceInfo?.ipAddress ||
				(req?.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
				'unknown',
			location: deviceInfo?.location || null,
			latitude: deviceInfo?.latitude || null,
			longitude: deviceInfo?.longitude || null,
			country: deviceInfo?.country || null,
			city: deviceInfo?.city || null,
			region: deviceInfo?.region || null,
			timezone: deviceInfo?.timezone || null,
			metadata: deviceInfo?.metadata ? JSON.stringify(deviceInfo.metadata) : null
		};

		await this.refreshTokens.create({
			userId: user.id,
			token: refreshToken,
			...finalDeviceInfo,
			isRevoked: false,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
		});

		return { accessToken, refreshToken, user: { ...resultDto } };
	}

	async refreshAccessToken(
		refreshToken: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		const tokenRecord = await this.refreshTokens.findOne({
			where: { token: refreshToken, isRevoked: false }
		});

		if (!tokenRecord) {
			throw new UnauthorizedException('Недействительный refresh токен');
		}

		if (tokenRecord.expiresAt < new Date()) {
			throw new UnauthorizedException('Refresh токен истёк');
		}

		// --- Проверка подписи токена ---
		let payload: any;
		try {
			payload = this.tokenRepository.verifyToken(
				refreshToken,
				process.env.JWT_REFRESH_SECRET
			);
		} catch (err) {
			throw new UnauthorizedException('Неверный refresh токен');
		}

		const user = await this.usersRepository.findByPk(payload.id);
		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		const newAccessToken = this.tokenRepository.sign(
			{
				id: user.id,
				roles: user.role
			},
			{ secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }
		);

		// --- Создаём новый refresh токен ---
		const newRefreshToken = this.tokenRepository.sign(
			{
				id: user.id,
				roles: user.role
			},
			{ secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }
		);

		// --- Обновляем запись в БД: заменяем старый токен на новый ---
		await tokenRecord.update({
			token: newRefreshToken,
			lastUsedAt: new Date(),
			usageCount: tokenRecord.usageCount + 1
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		};
	}

	async logout(refreshToken: string): Promise<{ message: string }> {
		const tokenRecord = await this.refreshTokens.findOne({
			where: { token: refreshToken, isRevoked: false }
		});

		if (!tokenRecord) {
			throw new UnauthorizedException('Токен не найден или уже неактивен');
		}

		tokenRecord.isRevoked = true;
		await tokenRecord.save();

		return { message: 'Вы успешно вышли из системы' };
	}

	async getProfile(userId: number): Promise<any> {
		const user = await this.usersRepository.findByPk(userId);

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		const userObj = user.get({ plain: true });
		delete userObj.passwordHash;

		return userObj;
	}

	async updateDataUsers(data: UsersDto) {
		const user = await this.usersRepository.findByPk(data.id);

		if (!user) {
			throw new Error('Администратор не найден');
		}

		await user.update(new UsersDto(data));

		return user;
	}

	async getUsersList(
		page: number,
		limit: number,
		search: string,
		sortBy: string,
		sortOrder: 'ASC' | 'DESC'
	) {
		// Вычисление смещения и лимита
		page = page > 0 ? page : 1;
		limit = limit > 0 ? limit : 10;
		const offset = limit === -1 ? 0 : (page - 1) * limit;

		// Формирование условий поиска
		const where = search
			? {
					[Op.or]: [
						{ name: { [Op.like]: `%${search.toLowerCase()}%` } },
						{ telegramId: { [Op.like]: `%${search.toLowerCase()}%` } },
						{ id: { [Op.like]: `%${search}%` } }
					]
				}
			: {};

		// Выполнение запроса
		const result = await this.usersRepository.findAndCountAll({
			where,
			offset: limit === -1 ? undefined : offset,
			limit: limit === -1 ? undefined : limit,
			attributes: { exclude: ['password'] },
			order: [[sortBy, sortOrder]]
		});

		// Деструктуризация результата
		const { count: totalItems, rows: users } = result;

		// Возвращение данных
		return {
			users,
			totalItems,
			totalPages: limit === -1 ? 1 : Math.ceil(totalItems / limit),
			currentPage: limit === -1 ? 1 : page
		};
	}
	async getRefreshTokens(userId: number) {
		const tokens = await this.refreshTokens.findAll({
			where: { userId },
			order: [['createdAt', 'DESC']]
		});

		return tokens;
	}

	async deleteUser(id: number) {
		const user = await this.usersRepository.findByPk(id);
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		await user.destroy();

		return 'Пользователь успешно удален';
	}
}

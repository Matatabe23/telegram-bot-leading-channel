import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/module/db/models/users.repository';
import { UsersDto } from './dto/user.dto';
import { TokenRepository } from 'src/module/service/token/token.repository';
import { TGBotUsersRepository } from 'src/module/service/tg-bot/repository/tg-bot-users.repository';
import { Op } from 'sequelize';
import { RefreshTokens } from 'src/module/db/models/refresh-tokens.repository';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(Users)
		private readonly usersRepository: typeof Users,
		@InjectModel(RefreshTokens)
		private readonly refreshTokens: typeof RefreshTokens,
		private readonly tokenRepository: TokenRepository,
		private readonly tGBotUsersRepository: TGBotUsersRepository
	) {}

	async login(name: string, ip: string | string[], userAgent: string) {
		if (!name) throw new UnauthorizedException('Некорректные данные');

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

		const accessToken = this.tokenRepository.generateToken(resultDto, '15m');
		const refreshToken = this.tokenRepository.generateToken(resultDto, '30d', true);

		await this.refreshTokens.create({
			token: refreshToken,
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
			ip: Array.isArray(ip) ? ip[0] : ip,
			userAgent: userAgent,
			device: userAgent,
			userId: user.id
		});

		return { accessToken, refreshToken, user: { ...resultDto } };
	}

	async checkDataWeb(id: number) {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user || !user.isTeamMember) return;
		const resultDto = new UsersDto(user);
		const accessToken = this.tokenRepository.generateToken({ ...resultDto }, '15m');
		return { accessToken, user: resultDto };
	}

	async updateAccessToken(refreshToken: string) {
		const decoded = this.tokenRepository.validateRefreshToken(refreshToken);

		const user = await this.usersRepository.findOne({
			where: { id: decoded.id }
		});

		if (!user) throw new NotFoundException('Пользователь не найден');
		const resultDto = new UsersDto(user.dataValues);
		const accessToken = this.tokenRepository.generateToken(resultDto, '15m');

		const newRefreshToken = this.tokenRepository.generateToken(resultDto, '7d', true);
		return { accessToken, refreshToken: newRefreshToken, user: resultDto };
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

	async deleteUser(id: number) {
		const user = await this.usersRepository.findByPk(id);
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		await user.destroy();

		return 'Пользователь успешно удален';
	}
}

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/module/db/models/users.repository';
import { UsersDto } from './dto/user.dto';
import { TokenRepository } from 'src/module/service/token/token.repository';
import * as bcrypt from 'bcrypt';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.repository';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(Users)
		private readonly usersRepository: typeof Users,
		private readonly tokenRepository: TokenRepository,
		private readonly tGBotService: TGBotService
	) {}

	async createUser(name: string, password: string) {
		if (!name || !password) {
			throw new UnauthorizedException('Некорректные данные');
		}

		const lowerName = name.toLowerCase();

		const existingUser = await this.usersRepository.findOne({
			where: { name: lowerName }
		});
		if (existingUser) {
			throw new UnauthorizedException('Пользователь с таким именем уже существует');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await this.usersRepository.create({
			name: name,
			password: hashedPassword,
			role: null,
			avatarUrl:
				'https://steamuserimages-a.akamaihd.net/ugc/1708538690062820758/000B5BFAFEA88146C04CC6C04630270AA2AD04D7/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
			telegramId: null
		});

		return {
			message: 'Пользователь успешно создан',
			user: {
				id: newUser.id,
				name: newUser.name,
				role: newUser.role
			}
		};
	}

	async login(name: string) {
		if (!name) throw new UnauthorizedException('Некорректные данные');

		const lowerName = name.toLowerCase();
		const user = await this.usersRepository.findOne({
			where: { name: lowerName }
		});

		if (!user) throw new NotFoundException('Пользователь не найден');
		if (!user.isTeamMember) throw new NotFoundException('Вы не участник команды');

		const isVerification = await this.tGBotService.requestLoginConfirmation(
			Number(user.telegramId)
		);
		if (!isVerification) throw new NotFoundException('Отказано во входе');

		const resultDto = new UsersDto(user.dataValues);

		const accessToken = this.tokenRepository.generateToken(resultDto, '15m');
		const refreshToken = this.tokenRepository.generateToken(resultDto, '7d', true);

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

		await user.update({
			name: data.name,
			role: data.role,
			avatarUrl: data.avatarUrl,
			telegramId: data.telegramId,
			isTeamMember: data.isTeamMember
		});

		return user;
	}

	async getUsersList(page: number, limit: number) {
		page = page > 0 ? page : 1;
		limit = limit > 0 ? limit : 10;

		const offset = (page - 1) * limit;

		const { rows: users, count: totalItems } = await this.usersRepository.findAndCountAll({
			offset,
			limit,
			attributes: ['id', 'name', 'role', 'avatarUrl', 'telegramId', 'isTeamMember'],
			order: [['id', 'ASC']]
		});

		return {
			users,
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: page
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

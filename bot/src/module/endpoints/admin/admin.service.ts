import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Administrators } from 'src/module/db/models/administrators.repository';
import { AdminDto } from './dto/admin.dto';
import { TokenRepository } from 'src/module/service/token/token.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(Administrators)
		private readonly adminRepository: typeof Administrators,
		private readonly tokenRepository: TokenRepository
	) {}

	async createUser(name: string, password: string) {
		if (!name || !password) {
			throw new UnauthorizedException('Некорректные данные');
		}

		const lowerName = name.toLowerCase();

		const existingUser = await this.adminRepository.findOne({
			where: { name: lowerName }
		});
		if (existingUser) {
			throw new UnauthorizedException('Пользователь с таким именем уже существует');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await this.adminRepository.create({
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

	async login(name: string, password: string) {
		if (!name || !password) throw new UnauthorizedException('Некорректные данные');

		const lowerName = name.toLowerCase();
		const admin = await this.adminRepository.findOne({
			where: { name: lowerName }
		});

		if (!admin) throw new NotFoundException('Пользователь не найден');

		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) throw new UnauthorizedException('Указан неверный пароль');

		const resultDto = new AdminDto(admin.dataValues);

		const accessToken = this.tokenRepository.generateToken(resultDto, '15m');
		const refreshToken = this.tokenRepository.generateToken(resultDto, '7d', true);

		return { accessToken, refreshToken, admin: { ...resultDto } };
	}

	async checkDataWeb(id: number) {
		const admin = await this.adminRepository.findOne({ where: { id } });
		if (!admin) return;
		const resultDto = new AdminDto(admin);
		const accessToken = this.tokenRepository.generateToken({ ...resultDto }, '15m');
		return { accessToken, admin: resultDto };
	}

	async updateAccessToken(refreshToken: string) {
		const decoded = this.tokenRepository.validateRefreshToken(refreshToken);

		const admin = await this.adminRepository.findOne({
			where: { id: decoded.id }
		});

		if (!admin) throw new NotFoundException('Пользователь не найден');
		const resultDto = new AdminDto(admin.dataValues);
		const accessToken = this.tokenRepository.generateToken(resultDto, '15m');

		const newRefreshToken = this.tokenRepository.generateToken(resultDto, '7d', true);
		return { accessToken, refreshToken: newRefreshToken, admin: resultDto };
	}

	async updateDataAdmin(data: AdminDto) {
		const admin = await this.adminRepository.findByPk(data.id);

		if (!admin) {
			throw new Error('Администратор не найден');
		}

		await admin.update({
			name: data.name,
			role: data.role,
			password: data.password,
			avatarUrl: data.avatarUrl,
			telegramId: data.telegramId
		});

		return admin;
	}

	async getUsersList(page: number, limit: number) {
		page = page > 0 ? page : 1;
		limit = limit > 0 ? limit : 10;

		const offset = (page - 1) * limit;

		const { rows: users, count: totalItems } = await this.adminRepository.findAndCountAll({
			offset,
			limit,
			attributes: ['id', 'name', 'role', 'avatarUrl', 'telegramId'],
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
		const user = await this.adminRepository.findByPk(id);
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		await user.destroy();

		return 'Пользователь успешно удален';
	}

	async updatePassword(id: number, oldPassword: string, newPassword: string) {
		if (!oldPassword || !newPassword) {
			throw new UnauthorizedException('Старый и новый пароли должны быть указаны');
		}
		const admin = await this.adminRepository.findByPk(id);
		if (!admin) {
			throw new NotFoundException('Пользователь не найден');
		}
		const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
		if (!isOldPasswordValid) {
			throw new UnauthorizedException('Старый пароль неверный');
		}
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);
		await admin.update({ password: hashedNewPassword });
		return 'Пароль успешно обновлен';
	}
}

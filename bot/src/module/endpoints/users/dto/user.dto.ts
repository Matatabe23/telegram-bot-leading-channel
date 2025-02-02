import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MUST_BE_BOOLEAN, MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';

export class UsersDto {
	@ApiProperty({
		description: 'Уникальный идентификатор пользователя',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'Иван Иванов'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		description: 'Роль пользователя (например, "admin", "user")',
		example: 'admin',
		required: false
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	role?: string;

	@ApiProperty({
		description: 'Ссылка на аватар пользователя',
		example: 'https://example.com/avatar.jpg',
		required: false
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	avatarUrl?: string;

	@ApiProperty({
		description: 'Идентификатор Telegram пользователя',
		example: 123456789,
		required: false
	})
	@IsOptional()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	telegramId?: number;

	@ApiProperty({
		description: 'Является ли пользователь членом команды',
		example: true,
		required: false
	})
	@IsOptional()
	@IsBoolean({ message: MUST_BE_BOOLEAN })
	isTeamMember?: boolean;

	@ApiProperty({
		description: 'Количество игровых монет пользователя',
		example: 100
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	coin: number;

	constructor(user: any) {
		this.id = user.id;
		this.name = user.name;
		this.role = user.role;
		this.avatarUrl = user.avatarUrl;
		this.telegramId = user.telegramId;
		this.isTeamMember = user.isTeamMember;
		this.coin = user.coin;
	}
}

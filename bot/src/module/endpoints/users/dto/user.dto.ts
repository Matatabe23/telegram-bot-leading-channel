import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';

export class UsersDto {
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	role?: string;

	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	password?: string;

	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	avatarUrl?: string;

	@IsOptional()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	telegramId?: number;

	constructor(user: any) {
		this.id = user.id;
		this.name = user.name;
		this.role = user.role;
		this.avatarUrl = user.avatarUrl;
		this.telegramId = user.telegramId;
	}
}
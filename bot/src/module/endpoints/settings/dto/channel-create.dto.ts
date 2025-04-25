import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MUST_BE_STRING } from 'src/const/errorConst';

export class ChannelCreateDto {
	@ApiProperty({
		description: 'Название канала',
		example: 'Мой канал'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		description: 'ChatId канала для идентификации',
		example: '123456789'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	chatId: string;
}

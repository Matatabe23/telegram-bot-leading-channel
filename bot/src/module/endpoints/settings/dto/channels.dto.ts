import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';
import { RegularPublicationTimeDto } from './regular-publication-time.dto';

export class ChannelsDto {
	@ApiProperty({
		description: 'Уникальный идентификатор канала',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@ApiProperty({
		description: 'Название канала',
		example: 'Мой канал'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		description: 'ChatId канала для идентификации в Telegram',
		example: '123456789'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	chatId: string;

	@ApiProperty({
		description: 'Настройки канала в виде строки JSON',
		example: '{"timezone": "UTC"}',
		required: false
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	settings?: string;

	@ApiProperty({
		description: 'Список регулярных времён публикации для канала',
		type: [RegularPublicationTimeDto],
		required: false
	})
	@IsOptional()
	regularPublicationTimes?: RegularPublicationTimeDto[];

	constructor(channel: any) {
		this.id = channel.id;
		this.name = channel.name;
		this.chatId = channel.chatId;
		this.settings = channel.settings;
		this.regularPublicationTimes = channel.regularPublicationTimes;
	}
}

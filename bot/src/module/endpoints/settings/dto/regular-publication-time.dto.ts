import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';

export class RegularPublicationTimeDto {
	@ApiProperty({
		description: 'Уникальный идентификатор записи времени публикации',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@ApiProperty({
		description: 'Час публикации',
		example: '14'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	hour: string;

	@ApiProperty({
		description: 'Минута публикации',
		example: '30'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	minute: string;

	@ApiProperty({
		description: 'Идентификатор канала, к которому привязано время публикации',
		example: 123
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	channelId: number;

	constructor(regularPublicationTime: any) {
		this.id = regularPublicationTime.id;
		this.hour = regularPublicationTime.hour;
		this.minute = regularPublicationTime.minute;
		this.channelId = regularPublicationTime.channelId;
	}
}

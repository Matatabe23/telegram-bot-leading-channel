import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';

export class AdvertisementDto {
	@ApiProperty({
		description: 'Уникальный идентификатор рекламного объявления',
		example: 1
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@ApiProperty({
		description: 'Идентификатор сообщения',
		example: 1001
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	messageId: number;

	@ApiProperty({
		description: 'Информация об удалении сообщения',
		example: '[{"messageId":5448,"channel":"-1002055196536","time":"2025-02-01 01:20"}]'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	deleteMessageInfo: string;

	@ApiProperty({
		description: 'Статус модерации объявления',
		example: 'approved'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	moderationStatus: string;

	@ApiProperty({
		description: 'Расписание для объявления',
		example: '[{"type":"random","times":"2025-02-01 01:00","channel":"-1002055196536"}]'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	schedule: string;

	@ApiProperty({
		description: 'Идентификатор источника чата',
		example: 12345
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	sourceChatId: number;

	@ApiProperty({
		description: 'Идентификатор пользователя, создавшего объявление',
		example: 67890
	})
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	userId: number;

	@ApiProperty({
		description: 'Дата и время создания объявления',
		example: '2025-02-01T12:00:00Z'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	createdAt: string;

	@ApiProperty({
		description: 'Дата и время последнего обновления объявления',
		example: '2025-02-01T12:30:00Z'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	updatedAt: string;

	constructor(advertisement: any) {
		this.id = advertisement.id;
		this.messageId = advertisement.messageId;
		this.deleteMessageInfo = advertisement.deleteMessageInfo;
		this.moderationStatus = advertisement.moderationStatus;
		this.schedule = advertisement.schedule;
		this.sourceChatId = advertisement.sourceChatId;
		this.userId = advertisement.userId;
		this.createdAt = advertisement.createdAt;
		this.updatedAt = advertisement.updatedAt;
	}
}

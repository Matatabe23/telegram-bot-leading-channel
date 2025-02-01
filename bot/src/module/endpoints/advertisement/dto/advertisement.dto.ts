import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { MUST_BE_NUMBER, MUST_BE_STRING } from 'src/const/errorConst';

export class AdvertisementDto {
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	id: number;

	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	messageId: number;

	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	deleteMessageInfo: string;

	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	moderationStatus: string;

	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	schedule: string;

	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	sourceChatId: number;

	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	userId: number;

	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	createdAt: string;

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

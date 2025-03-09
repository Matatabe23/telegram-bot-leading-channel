import { IsString } from 'class-validator';

export class UpdateHolidaysDto {
	@IsString()
	name: string;

	@IsString()
	startDate: string;

	@IsString()
	endDate: string;

	@IsString()
	eventName: string;
}

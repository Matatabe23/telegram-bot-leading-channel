import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
	IsNumber,
	IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { MUST_BE_STRING } from 'src/const/errorConst';

export class DeviceInfoDto {
	@ApiProperty({ example: 'MacBook Pro 16', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	deviceName?: string;

	@ApiProperty({ example: 'desktop', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	deviceType?: string;

	@ApiProperty({
		example:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
		required: false
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	userAgent?: string;

	@ApiProperty({ example: '000.000.0.00', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	ipAddress?: string;

	@ApiProperty({ example: 'Moscow, Russia', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	location?: string;

	@ApiProperty({ example: 55.7558, required: false })
	@IsOptional()
	@IsNumber()
	latitude?: number;

	@ApiProperty({ example: 37.6173, required: false })
	@IsOptional()
	@IsNumber()
	longitude?: number;

	@ApiProperty({ example: 'Russia', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	country?: string;

	@ApiProperty({ example: 'Moscow', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	city?: string;

	@ApiProperty({ example: 'Moscow Oblast', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	region?: string;

	@ApiProperty({ example: 'Europe/Moscow', required: false })
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	timezone?: string;

	@ApiProperty({ example: { custom: 'value' }, required: false })
	@IsOptional()
	@IsObject()
	metadata?: Record<string, any>;
}

export class LoginUserDto {
	@ApiProperty({
		description: 'login пользователя ',
		example: 'qugor или qugor@example.com'
	})
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		description: 'Данные устройства',
		type: DeviceInfoDto,
		required: false
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => DeviceInfoDto)
	deviceInfo?: DeviceInfoDto;
}

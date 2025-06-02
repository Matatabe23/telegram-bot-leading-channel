import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WaterMarkPosition } from 'src/types/types';
import {
	MUST_BE_BOOLEAN,
	MUST_BE_ENUM,
	MUST_BE_NUMBER,
	MUST_BE_STRING
} from 'src/const/errorConst';

export class CreateWaterMarkRequestDto {
	@ApiProperty({ example: 'Зимний стиль', description: 'Название водяного знака' })
	@IsNotEmpty()
	@IsString({ message: MUST_BE_STRING })
	name: string;

	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'Файл изображения водяного знака (PNG, JPG, WebP и т.д.)'
	})
	image: any; // файл отдельно обрабатывается через FileInterceptor

	@ApiPropertyOptional({
		example: '12-25 08:00',
		description: 'Дата начала действия водяного знака'
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	startDate?: string;

	@ApiPropertyOptional({
		example: '12-26 23:59',
		description: 'Дата окончания действия водяного знака'
	})
	@IsOptional()
	@IsString({ message: MUST_BE_STRING })
	endDate?: string;

	@ApiPropertyOptional({
		example: false,
		description: 'Является ли водяной знак дефолтным'
	})
	@IsOptional()
	@IsBoolean({ message: MUST_BE_BOOLEAN })
	isDefault?: boolean;

	@ApiPropertyOptional({
		enum: WaterMarkPosition,
		example: WaterMarkPosition.BOTTOM_RIGHT,
		description: 'Положение водяного знака на изображении'
	})
	@IsOptional()
	@IsEnum(WaterMarkPosition, { message: MUST_BE_ENUM })
	position?: WaterMarkPosition;

	@ApiProperty({ example: 1, description: 'ID канала, к которому привязан водяной знак' })
	@IsNotEmpty()
	@IsNumber({}, { message: MUST_BE_NUMBER })
	channelId: number;
}

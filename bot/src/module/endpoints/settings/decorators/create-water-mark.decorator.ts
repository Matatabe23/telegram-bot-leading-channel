import { ApiResponse, ApiBody, ApiOperation, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

class CreateWaterMarkResponseDto {
	@ApiProperty({ example: 'Водяной знак успешно создан' })
	message: string;

	@ApiProperty({ example: 42, description: 'ID созданного водяного знака' })
	id: number;
}

export function createWaterMark(): MethodDecorator {
	return (target, propertyKey, descriptor) => {
		ApiOperation({
			summary: 'Создание водяного знака',
			description: 'Загружает изображение и создаёт водяной знак, привязанный к каналу'
		})(target, propertyKey, descriptor);

		ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);

		ApiBody({
			description: 'Данные для создания водяного знака и файл изображения',
			schema: {
				type: 'object',
				properties: {
					name: { type: 'string', example: 'Зимний стиль' },
					image: {
						type: 'string',
						format: 'binary',
						description: 'Файл изображения водяного знака'
					},
					startDate: { type: 'string', example: '12-25 08:00' },
					endDate: { type: 'string', example: '12-26 23:59' },
					isDefault: { type: 'boolean', example: false },
					position: {
						type: 'string',
						enum: [
							'TOP_LEFT',
							'TOP_RIGHT',
							'BOTTOM_LEFT',
							'BOTTOM_RIGHT',
							'CENTER',
							'BOTTOM_CENTER'
						],
						example: 'BOTTOM_RIGHT'
					},
					channelId: { type: 'number', example: 1 }
				},
				required: ['name', 'image', 'channelId']
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 201,
			description: 'Водяной знак успешно создан',
			type: CreateWaterMarkResponseDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 400,
			description: 'Некорректные данные',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

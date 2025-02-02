import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

export function EditChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'ID канала и настройки для обновления',
			schema: {
				type: 'object',
				properties: {
					id: { type: 'number', example: 1 },
					settings: {
						type: 'array',
						items: { type: 'string', example: 'setting1' }
					}
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Настройки канала успешно обновлены',
			type: String
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 404,
			description: 'Канал не найден',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

export function DeletePublicationTime(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'ID записи времени публикации для удаления',
			schema: {
				type: 'object',
				properties: {
					id: { type: 'number', example: 1 }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Запись времени публикации успешно удалена',
			type: String
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 404,
			description: 'Запись не найдена',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

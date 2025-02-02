import { RegularPublicationTimeDto } from './../dto/regular-publication-time.dto';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

export function AddPublicationTime(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'Час и минута для публикации, а также id канала для привязки времени',
			schema: {
				type: 'object',
				properties: {
					hour: { type: 'string', example: '10' },
					minute: { type: 'string', example: '30' },
					channelId: { type: 'number', example: 1 }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 201,
			description: 'Время публикации успешно добавлено',
			type: RegularPublicationTimeDto
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

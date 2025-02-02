import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RegularPublicationTimeDto } from '../dto/regular-publication-time.dto';

export function GetListRegularPublicationTimes(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список времени публикации для канала',
			type: [RegularPublicationTimeDto]
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

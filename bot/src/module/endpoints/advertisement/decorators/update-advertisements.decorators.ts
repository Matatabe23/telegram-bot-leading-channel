import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AdvertisementDto } from '../dto/advertisement.dto';

// Кастомный декоратор для объединения ApiBody и ApiResponse
export function UpdateAdvertisements(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'Обновлённое рекламное объявление',
			type: AdvertisementDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Рекламное объявление обновлено',
			type: AdvertisementDto
		})(target, propertyKey, descriptor);
	};
}

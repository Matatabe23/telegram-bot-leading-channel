import { ApiResponse } from '@nestjs/swagger';
import { AdvertisementDto } from '../dto/advertisement.dto';

export function GetAdvertisements(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список рекламных объявлений',
			type: [AdvertisementDto]
		})(target, propertyKey, descriptor);
	};
}

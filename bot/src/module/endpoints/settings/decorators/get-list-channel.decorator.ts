import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelsDto } from '../dto/channels.dto';

export function GetListChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список каналов успешно получен',
			type: [ChannelsDto]
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

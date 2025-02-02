import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelsDto } from '../dto/channels.dto';

export function AddNewChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'Название канала и его chatId для добавления нового канала',
			schema: {
				type: 'object',
				properties: {
					name: { type: 'string', example: 'New Channel' },
					chatId: { type: 'string', example: '987654' }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 201,
			description: 'Канал успешно добавлен',
			type: ChannelsDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

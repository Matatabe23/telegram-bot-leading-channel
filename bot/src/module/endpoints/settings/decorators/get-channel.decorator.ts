import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelsDto } from '../dto/channels.dto';

class ChannelResponseDto {
	@ApiProperty({ type: ChannelsDto })
	data: ChannelsDto;

	@ApiProperty({ example: 'Канал успешно получен' })
	message: string;
}

export function getChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Получение канала',
			description: 'Метод для получения конкретного канала по его айди'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Канал успешно получен',
			type: ChannelResponseDto
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

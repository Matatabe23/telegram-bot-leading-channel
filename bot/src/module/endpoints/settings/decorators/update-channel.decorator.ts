import { ApiResponse, ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelsDto } from '../dto/channels.dto';

class updateChannelResponseDto {
	@ApiProperty({ type: ChannelsDto })
	data: ChannelsDto;

	@ApiProperty({ example: 'Канал и расписание успешно обновлены' })
	message: string;
}

export function updateChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Обновление канала',
			description: 'Метод для обновления канала и времени публикации'
		})(target, propertyKey, descriptor);

		ApiBody({
			description: 'Данные для обновления канала',
			type: ChannelsDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Канал и расписание успешно обновлены',
			type: updateChannelResponseDto
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

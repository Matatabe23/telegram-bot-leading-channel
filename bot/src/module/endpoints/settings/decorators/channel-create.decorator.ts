import { ApiResponse, ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelCreateDto } from '../dto/channel-create.dto';
import { ChannelsDto } from '../dto/channels.dto';

class CreateChannelResponseDto {
	@ApiProperty({ type: ChannelsDto })
	data: ChannelsDto;

	@ApiProperty({ example: 'Канал успешно создан' })
	message: string;
}

export function channelCreate(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Создание канала',
			description: 'Метод для создания канала'
		})(target, propertyKey, descriptor);

		ApiBody({
			description: 'Данные для создания канала',
			type: ChannelCreateDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Канал успешно создан',
			type: CreateChannelResponseDto
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

import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { ChannelsDto } from '../dto/channels.dto';

class ChannelListResponseDto {
	@ApiProperty({ type: [ChannelsDto] })
	data: [ChannelsDto];

	@ApiProperty({ example: 'Список каналов получен' })
	message: string;
}

export function GetListChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Список каналов',
			description: 'Возвращает список каналов и время публикации связанное с ними'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Список успешно получен',
			type: ChannelListResponseDto
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

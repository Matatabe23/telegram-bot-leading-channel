import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

class deleteChannelResponseDto {
	@ApiProperty({ example: 'Канал успешно удален' })
	message: string;
}

export function DeleteChannel(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Удаление канала',
			description: 'Метод для удаления канала'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Канал успешно удален',
			type: deleteChannelResponseDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

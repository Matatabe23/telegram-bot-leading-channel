import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

class deleteChannelResponseDto {
	@ApiProperty({ example: 'Время успешно удалено' })
	message: string;
}

export function DeleteTime(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Удаление времени',
			description: 'Метод для удаления времени канала'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Время успешно удалено',
			type: deleteChannelResponseDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

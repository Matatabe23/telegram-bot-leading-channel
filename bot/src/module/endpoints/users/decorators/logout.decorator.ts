import { ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

class LogoutRequestDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'Refresh-токен, который нужно деактивировать'
	})
	refreshToken: string;
}

class LogoutResponseDto {
	@ApiProperty({ example: 'Вы успешно вышли из системы' })
	message: string;
}

export function LogoutDoc(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({
			summary: 'Выход пользователя',
			description: 'Деактивирует конкретный refresh-токен'
		})(target, propertyKey, descriptor);

		ApiBody({
			type: LogoutRequestDto,
			description: 'Refresh-токен для выхода из системы'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Пользователь успешно вышел',
			type: LogoutResponseDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 401,
			description: 'Недействительный или неактивный refresh-токен',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

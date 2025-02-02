import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

export function UpdateAccessToken(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiQuery({
			name: 'refreshToken',
			description: 'Токен обновления',
			example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Обновленный токен доступа',
			type: String
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

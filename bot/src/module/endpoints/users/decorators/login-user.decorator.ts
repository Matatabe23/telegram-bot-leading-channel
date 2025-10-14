import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from '../dto/login.dto';
import { ErrorDto } from 'src/dto/error.dto';

export function LoginDoc(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		// Описание ручки
		ApiOperation({
			summary: 'Вход пользователя',
			description: 'Позволяет пользователю авторизоваться по email или имени и паролю'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Пользователь успешно вошёл в систему',
			type: LoginUserDto // Можно заменить на DTO ответа, если есть
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 400,
			description: 'Неверный логин/email или пароль',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

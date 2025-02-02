import { ApiResponse } from '@nestjs/swagger';
import { UsersDto } from '../dto/user.dto';
import { ErrorDto } from 'src/dto/error.dto';

export function CheckUserData(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Данные пользователя успешно получены',
			type: UsersDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 401,
			description: 'Ошибка авторизации',
			type: ErrorDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

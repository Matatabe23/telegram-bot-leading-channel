import { ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersDto } from '../dto/user.dto';
import { ErrorDto } from 'src/dto/error.dto';

export function LoginUser(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiQuery({
			name: 'name',
			description: 'Имя пользователя для входа',
			example: 'Иван Иванов'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Успешный вход пользователя',
			type: UsersDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

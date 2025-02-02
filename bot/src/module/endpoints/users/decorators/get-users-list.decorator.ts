import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { UsersDto } from '../dto/user.dto';

export function GetUsersList(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список пользователей успешно получен',
			type: [UsersDto]
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

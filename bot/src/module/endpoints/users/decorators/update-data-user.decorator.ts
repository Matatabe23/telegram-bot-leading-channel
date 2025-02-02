import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersDto } from '../dto/user.dto';
import { ErrorDto } from 'src/dto/error.dto';

export function UpdateUserData(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'Данные для обновления пользователя',
			type: UsersDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Данные пользователя успешно обновлены',
			type: UsersDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

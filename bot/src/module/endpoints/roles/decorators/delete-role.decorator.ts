import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RoleDto } from '../dto/role.dto';

export function DeleteRole(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Роль успешно удалена',
			type: RoleDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 404,
			description: 'Роль не найдена',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

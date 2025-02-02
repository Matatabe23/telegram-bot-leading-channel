import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RoleDto } from '../dto/role.dto';

export function GetRoles(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список ролей успешно получен',
			type: [RoleDto] // Массив ролей
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

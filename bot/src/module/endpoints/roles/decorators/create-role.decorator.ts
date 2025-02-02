import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RoleDto } from '../dto/role.dto';

export function CreateRole(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description: 'Название роли, которое будет присвоено новой роли',
			schema: {
				type: 'object',
				properties: {
					nameRole: {
						type: 'string',
						example: 'admin'
					}
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 201,
			description: 'Роль успешно создана',
			type: RoleDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

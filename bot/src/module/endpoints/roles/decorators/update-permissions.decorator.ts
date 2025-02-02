import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RoleDto } from '../dto/role.dto';

export function UpdatePermissions(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiBody({
			description:
				'Список прав роли. Ожидается строка с правами, разделёнными запятой (например: "edit_roles,edit_users,edit_post,delete_posts,mark_post_viewed")',
			schema: {
				type: 'string',
				example: 'edit_roles,edit_users,edit_post,delete_posts,mark_post_viewed'
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Права роли успешно обновлены',
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

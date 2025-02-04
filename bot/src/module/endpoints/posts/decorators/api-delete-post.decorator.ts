import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiDeletePost(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Удаление поста' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Пост успешно удалён',
			schema: {
				example: {
					pagination: null,
					data: null,
					message: 'Пост успешно удален'
				}
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 400,
			description: 'Некорректный запрос'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 404,
			description: 'Пост не найден'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

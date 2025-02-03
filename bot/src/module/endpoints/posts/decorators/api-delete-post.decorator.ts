import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiDeletePost(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Удаление поста' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Пост успешно удалён'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

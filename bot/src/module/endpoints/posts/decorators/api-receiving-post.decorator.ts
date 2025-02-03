import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiReceivingPost(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Получение конкретного поста' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Пост успешно получен'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiReceiving(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Получение списка постов' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Список постов успешно получен'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

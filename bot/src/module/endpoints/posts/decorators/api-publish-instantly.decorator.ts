import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiPublishInstantly(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Мгновенная публикация существующего поста' })(
			target,
			propertyKey,
			descriptor
		);
		ApiResponse({
			status: 200,
			description: 'Пост мгновенно опубликован'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

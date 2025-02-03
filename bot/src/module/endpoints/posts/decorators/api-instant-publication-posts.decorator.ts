import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiInstantPublicationPosts(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Мгновенная публикация поста' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 201,
			description: 'Пост мгновенно опубликован'
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

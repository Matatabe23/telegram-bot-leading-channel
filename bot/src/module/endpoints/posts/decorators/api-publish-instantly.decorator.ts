import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiPublishInstantly(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Мгновенная публикация существующего поста' })(
			target,
			propertyKey,
			descriptor
		);
		ApiResponse({
			status: 201,
			description: 'Пост успешно опубликован',
			schema: {
				type: 'object',
				properties: {
					pagination: { type: 'null', example: null },
					data: {
						oneOf: [{ type: 'null', example: null }]
					},
					message: { type: 'string', example: 'Успешная моментальная публикация!' }
				}
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

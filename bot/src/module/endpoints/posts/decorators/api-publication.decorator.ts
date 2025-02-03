import { ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

export function ApiPublication(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Публикация поста' })(target, propertyKey, descriptor);

		ApiBody({
			schema: {
				type: 'object',
				properties: {
					files: {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary'
						}
					},
					waterMark: { type: 'boolean', example: true },
					chatIdList: { type: 'integer', example: -1002108489000 }
				},
				required: ['files', 'waterMark', 'chatIdList']
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 201,
			description: 'Пост успешно опубликован',
			schema: {
				type: 'object',
				properties: {
					pagination: { type: 'null', example: null },
					data: {
						type: 'object',
						properties: {
							watched: { type: 'boolean', example: false },
							id: { type: 'integer', example: 3 },
							waterMark: { type: 'boolean', example: true },
							updatedAt: {
								type: 'string',
								format: 'date-time',
								example: '2025-02-03T18:17:04.080Z'
							},
							createdAt: {
								type: 'string',
								format: 'date-time',
								example: '2025-02-03T18:17:04.080Z'
							}
						}
					},
					message: { type: 'string', example: 'Успешное сохранение в базу данных!' }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

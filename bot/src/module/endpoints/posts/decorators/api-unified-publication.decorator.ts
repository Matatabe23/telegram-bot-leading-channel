import { ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

export function ApiUnifiedPublication(): MethodDecorator {
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
					chatIdList: { type: 'string', example: '-1002108489000,-1002108489001' },
					isInstant: { type: 'boolean', example: false }
				},
				required: ['files', 'waterMark', 'chatIdList', 'isInstant']
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
						oneOf: [
							{ type: 'null', example: null },
							{
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
							}
						]
					},
					message: { type: 'string', example: 'Успешное сохранение в базу данных!' }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 400,
			description: 'Некорректные входные данные'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 404,
			description: 'Не найдены каналы для публикации'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

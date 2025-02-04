import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiReceiving(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Получение списка постов' })(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Успешное получение постов',
			schema: {
				type: 'object',
				properties: {
					pagination: {
						type: 'object',
						properties: {
							count: { type: 'integer', example: 1 },
							currentPage: { type: 'integer', example: 1 },
							perpage: { type: 'integer', example: 3 }
						}
					},
					data: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'integer', example: 13 },
								watched: { type: 'boolean', example: true },
								waterMark: { type: 'boolean', example: true },
								createdAt: {
									type: 'string',
									format: 'date-time',
									example: '2025-02-04T20:13:02.000Z'
								},
								updatedAt: {
									type: 'string',
									format: 'date-time',
									example: '2025-02-04T20:43:27.000Z'
								},
								channels: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'integer', example: 2 },
											name: { type: 'string', example: 'test' },
											chatId: { type: 'string', example: '-1002108489000' }
										}
									}
								},
								images: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'integer', example: 32 },
											image: {
												type: 'string',
												example:
													'https://storage.clo.ru/qugor-default-bucket/image.webp'
											}
										}
									}
								}
							}
						}
					},
					publishTime: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'integer', example: 1 },
								hour: { type: 'string', example: '1' },
								minute: { type: 'string', example: '3' },
								channelId: { type: 'integer', example: 2 }
							}
						}
					},
					message: { type: 'string', example: 'Успешное получение постов' }
				}
			}
		})(target, propertyKey, descriptor);

		ApiResponse({ status: 400, description: 'Некорректные входные данные' })(
			target,
			propertyKey,
			descriptor
		);
		ApiResponse({ status: 404, description: 'Посты не найдены' })(
			target,
			propertyKey,
			descriptor
		);
		ApiResponse({ status: 500, description: 'Ошибка на сервере' })(
			target,
			propertyKey,
			descriptor
		);
	};
}

import { ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

export function ApiUpdatePost(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Редактирование привязки поста к каналам' })(
			target,
			propertyKey,
			descriptor
		);
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					postId: { type: 'number', example: 1 },
					channelIds: { type: 'array', items: { type: 'number' }, example: [1] },
					images: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								id: { type: 'number' },
								dataBasePostId: { type: 'number' },
								img: { type: 'string' }
							}
						},
						example: [
							{ id: 8, dataBasePostId: 5, img: 'https://storage.clo.ru/...webp' }
						]
					}
				},
				required: ['postId', 'channelIds']
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Привязка успешно обновлена',
			schema: {
				type: 'object',
				properties: {
					pagination: { type: 'null', example: null },
					data: {
						type: 'object',
						properties: {
							imageList: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: { type: 'number', example: 1 },
										img: {
											type: 'string',
											example: 'https://storage.clo.ru/.../1.webp'
										},
										dataBasePostId: { type: 'number', example: 1 }
									}
								}
							},
							post: {
								type: 'object',
								properties: {
									id: { type: 'number', example: 1 },
									watched: { type: 'boolean', example: true },
									waterMark: { type: 'boolean', example: true },
									createdAt: {
										type: 'string',
										format: 'date-time',
										example: '2025-02-03T18:13:24.000Z'
									},
									updatedAt: {
										type: 'string',
										format: 'date-time',
										example: '2025-02-03T18:22:28.000Z'
									},
									channels: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'number', example: 1 },
												name: { type: 'string', example: 'test' },
												chatId: {
													type: 'string',
													example: '-1002108489000'
												},
												settings: { type: 'string', example: '' },
												createdAt: {
													type: 'string',
													format: 'date-time',
													example: '2025-02-02T16:26:35.000Z'
												},
												updatedAt: {
													type: 'string',
													format: 'date-time',
													example: '2025-02-02T16:26:35.000Z'
												},
												ChannelPosts: {
													type: 'object',
													properties: {
														channelId: { type: 'number', example: 1 },
														postId: { type: 'number', example: 1 },
														createdAt: {
															type: 'string',
															format: 'date-time',
															example: '2025-02-03T18:34:48.000Z'
														},
														updatedAt: {
															type: 'string',
															format: 'date-time',
															example: '2025-02-03T18:34:48.000Z'
														}
													}
												}
											}
										}
									},
									images: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'number', example: 1 },
												image: {
													type: 'string',
													example:
														'QugorArtsTelegramBotDev/1/1738606404264.webp'
												},
												dataBasePostId: { type: 'number', example: 1 },
												createdAt: {
													type: 'string',
													format: 'date-time',
													example: '2025-02-03T18:13:25.000Z'
												},
												updatedAt: {
													type: 'string',
													format: 'date-time',
													example: '2025-02-03T18:13:25.000Z'
												}
											}
										}
									}
								}
							}
						}
					},
					message: { type: 'string', example: 'Успешное обновление поста!' }
				}
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

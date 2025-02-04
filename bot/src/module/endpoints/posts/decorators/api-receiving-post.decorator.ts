import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiReceivingPost(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Получение конкретного поста' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Пост успешно получен',
			schema: {
				example: {
					pagination: null,
					imageList: [
						{
							id: 41,
							img: 'https://storage.clo.ru/....webp',
							dataBasePostId: 15
						}
					],
					channelsPost: [
						{
							id: 2,
							name: 'test',
							chatId: '-1002108489000',
							settings: '',
							createdAt: '2025-02-04T19:55:06.000Z',
							updatedAt: '2025-02-04T19:55:06.000Z',
							ChannelPosts: {
								channelId: 2,
								postId: 15,
								createdAt: '2025-02-04T20:54:59.000Z',
								updatedAt: '2025-02-04T20:54:59.000Z'
							}
						}
					],
					message: 'Успешное получение поста'
				}
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 404,
			description: 'Пост не найден',
			schema: {
				example: {
					pagination: null,
					imageList: [],
					channelsPost: [],
					message: 'Пост не найден'
				}
			}
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере',
			schema: {
				example: {
					pagination: null,
					imageList: null,
					channelsPost: null,
					message: 'Ошибка на сервере'
				}
			}
		})(target, propertyKey, descriptor);
	};
}

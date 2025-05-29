import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

export function DeleteFilesFromS3Swagger(): MethodDecorator {
	return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		ApiOperation({
			summary: 'Удаление файлов из S3',
			description: 'Позволяет удалить один или несколько файлов из S3 по ссылкам'
		})(target, propertyKey, descriptor);

		ApiBody({
			schema: {
				type: 'object',
				properties: {
					urls: {
						type: 'array',
						items: {
							type: 'string',
							example:
								'https://your-s3-bucket.amazonaws.com/saved/folder123/filename.png'
						},
						description: 'Массив ссылок на файлы, которые нужно удалить'
					}
				},
				required: ['urls']
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Файлы успешно удалены'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Внутренняя ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

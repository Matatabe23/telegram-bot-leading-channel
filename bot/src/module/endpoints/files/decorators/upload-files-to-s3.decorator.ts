import { ApiBody, ApiResponse, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadFilesDto } from '../dto/UploadFiles.dto';
import { ErrorDto } from 'src/dto/error.dto';

export function UploadFilesToS3Swagger(): MethodDecorator {
	return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		ApiOperation({
			summary: 'Загрузка файлов на S3',
			description: 'Позволяет загрузить один или несколько файлов и указать имя группы файлов'
		})(target, propertyKey, descriptor);

		ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);

		ApiBody({
			description: 'Форма для загрузки файлов и имени группы',
			schema: {
				type: 'object',
				properties: {
					fileName: {
						type: 'string',
						example: 'advertisement_banner'
					},
					'files[]': {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary'
						},
						description: 'Один или несколько файлов'
					}
				},
				required: ['fileName', 'files[]']
			}
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description: 'Файлы успешно загружены на S3',
			type: UploadFilesDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Внутренняя ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

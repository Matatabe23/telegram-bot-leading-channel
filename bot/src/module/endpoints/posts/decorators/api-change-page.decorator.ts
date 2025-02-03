import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PostsDto } from '../dto/posts.dto';

export function ApiChangePage(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiOperation({ summary: 'Изменение страницы постов' })(target, propertyKey, descriptor);
		ApiResponse({
			status: 200,
			description: 'Страница успешно изменена',
			type: PostsDto
		})(target, propertyKey, descriptor);
		ApiResponse({
			status: 500,
			description: 'Ошибка на сервере'
		})(target, propertyKey, descriptor);
	};
}

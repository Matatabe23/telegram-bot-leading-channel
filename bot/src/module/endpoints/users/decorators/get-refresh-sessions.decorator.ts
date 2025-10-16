import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';
import { RefreshTokenSessionDto } from '../dto/refresh-token-session.dto';

export function GetRefreshSessionsDocs(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		ApiResponse({
			status: 200,
			description: 'Список активных сессий успешно получен',
			type: [RefreshTokenSessionDto]
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

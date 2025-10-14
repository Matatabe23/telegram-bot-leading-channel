import { ApiResponse, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/dto/error.dto';

class RefreshTokenRequestDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'Refresh-токен пользователя'
	})
	refreshToken: string;
}

class RefreshTokenResponseDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'Новый access-токен'
	})
	accessToken: string;

	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description: 'Refresh-токен (старый или новый, в зависимости от логики)'
	})
	refreshToken: string;
}

export function RefreshTokenDoc(): MethodDecorator {
	return function (target, propertyKey, descriptor) {
		// Описание ручки
		ApiOperation({
			summary: 'Обновление access-токена',
			description:
				'Принимает refresh-токен, проверяет его и возвращает новый access-токен и новый refresh-токен (ротация токенов)'
		})(target, propertyKey, descriptor);

		ApiBody({
			type: RefreshTokenRequestDto,
			description: 'Refresh-токен для обновления пары токенов'
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 200,
			description:
				'Новый access-токен и новый refresh-токен успешно сгенерированы (старый refresh-токен заменен)',
			type: RefreshTokenResponseDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 401,
			description: 'Недействительный или просроченный refresh-токен',
			type: ErrorDto
		})(target, propertyKey, descriptor);

		ApiResponse({
			status: 500,
			description: 'Ошибка сервера',
			type: ErrorDto
		})(target, propertyKey, descriptor);
	};
}

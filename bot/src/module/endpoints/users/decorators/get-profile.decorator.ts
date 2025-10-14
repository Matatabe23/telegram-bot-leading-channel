import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetProfileDoc() {
	return applyDecorators(
		ApiOperation({ summary: 'Получение профиля пользователя' }),
		ApiResponse({
			status: 200,
			description: 'Успешный ответ с данными пользователя',
			schema: {
				example: {
					id: 1,
					name: 'qutor',
					email: 'test@mail.com',
					firstName: 'John',
					lastName: 'Doe',
					phone: '+79998887766',
					isActive: true,
					isEmailVerified: true,
					createdAt: '2025-09-14T10:00:00.000Z',
					updatedAt: '2025-09-14T10:00:00.000Z'
				}
			}
		}),
		ApiResponse({ status: 401, description: 'Вы не авторизированы' })
	);
}

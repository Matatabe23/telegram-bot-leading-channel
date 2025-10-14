import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenRepository {
	constructor(private readonly jwtService: JwtService) {}

	/**
	 * Универсальная генерация токена
	 */
	sign<T extends object>(payload: T, options: JwtSignOptions): string {
		return this.jwtService.sign(payload, options);
	}

	/**
	 * Проверка токена
	 * @param token - строка токена
	 * @param secret - секрет для верификации (если отличается от дефолтного)
	 */
	verifyToken<T extends object = any>(token: string, secret?: string): T {
		return this.jwtService.verify<T>(token, secret ? { secret } : {});
	}
}

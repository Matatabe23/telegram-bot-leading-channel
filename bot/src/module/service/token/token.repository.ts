import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenRepository {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	generateToken(payload: any, tokenTime: string, isRefreshToken: boolean = false) {
		if (!payload) throw new Error('Payload is undefined');

		const secretKey = isRefreshToken
			? this.configService.get('SECRET_KEY_REFRESH')
			: this.configService.get('SECRET_KEY_ACCESS');

		if (!secretKey) {
			throw new Error('SECRET_KEY is not defined');
		}

		const token = this.jwtService.sign(
			{ ...payload },
			{
				secret: secretKey,
				expiresIn: tokenTime
			}
		);
		return token;
	}

	validateRefreshToken(refreshToken: string) {
		try {
			const secret = this.configService.get('SECRET_KEY_REFRESH');
			return this.jwtService.verify(refreshToken, { secret });
		} catch (e) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}
	}
}

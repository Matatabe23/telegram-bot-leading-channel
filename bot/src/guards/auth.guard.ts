// src/guards/auth.guard.ts
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new HttpException('Нету авторизации', HttpStatus.UNAUTHORIZED);
		}

		const token = authHeader.split(' ')[1];

		if (!token) {
			throw new HttpException('Нету авторизации', HttpStatus.UNAUTHORIZED);
		}

		try {
			const decoded = this.jwtService.verify(token);

			if (!decoded.isTeamMember) {
				return false;
			}

			request.authData = decoded;
			return true;
		} catch (e) {
			throw new HttpException('Нету авторизации', HttpStatus.UNAUTHORIZED);
		}
	}
}

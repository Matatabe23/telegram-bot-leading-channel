import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CheckPermissionsGuard implements CanActivate {
	private permission: string;

	constructor(
		@InjectModel(RolesSettings) private readonly rolesSettings: typeof RolesSettings,
		private jwtService: JwtService
	) {}

	static withPermission(permission: string) {
		const guard = new CheckPermissionsGuard(RolesSettings, new JwtService());
		guard.permission = permission;
		return guard;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;
		const token = authHeader.split(' ')[1];
		const user = this.jwtService.verify(token, { secret: process.env.SECRET_KEY_ACCESS });

		if (!this.permission) {
			throw new HttpException('Нет разрешения', HttpStatus.FORBIDDEN);
		}

		const requiredPermissions = await this.getRolePermissions(user.role);

		if (!requiredPermissions || !this.permission || !requiredPermissions.permissions) {
			throw new HttpException('У вас нет необходимых разрешений', HttpStatus.FORBIDDEN);
		}

		const isPermissions = requiredPermissions.permissions.includes(this.permission);

		if (!isPermissions) {
			throw new HttpException('У вас нет необходимых разрешений', HttpStatus.FORBIDDEN);
		}

		return true;
	}

	private async getRolePermissions(role: string) {
		const result = await this.rolesSettings.findOne({ where: { name: role } });
		return result.dataValues;
	}
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EPermissions } from 'src/const/const';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';

@Injectable()
export class HelpersRepository {
	constructor(@InjectModel(RolesSettings) private readonly rolesSettings: typeof RolesSettings) {}

	async checkPermissions(role: string, permission: EPermissions) {
		const requiredPermissions = await this.rolesSettings.findOne({ where: { name: role } });
		console.log(requiredPermissions.dataValues.permissions);
		if (!requiredPermissions.dataValues.permissions) return false;
		return requiredPermissions.dataValues.permissions.includes(permission);
	}
}

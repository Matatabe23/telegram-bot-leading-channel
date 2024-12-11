import { Users } from 'src/module/db/models/users.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';
import { EPermissions } from 'src/const/const';

@Injectable()
export class InitDataRepository implements OnModuleInit {
	constructor(
		@InjectModel(Users)
		private readonly users: typeof Users,
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings
	) {}

	async onModuleInit() {
		this.createDefaultRole();
	}

	async createDefaultRole() {
		const name = process.env.DEFAULT_ROLE.toLowerCase();
		const existingRole = await this.rolesSettings.findOne({
			where: { name: name }
		});

		if (existingRole) return;

		await this.rolesSettings.create({
			name: process.env.DEFAULT_ROLE,
			permissions: Object.values(EPermissions).join(',')
		});
	}
}

import { Users } from 'src/module/db/models/users.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
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

	async createDefaultUser() {
		const lowerName = process.env.DEFAULT_USER_NAME.toLowerCase();
		const name = process.env.DEFAULT_USER_NAME;
		const password = process.env.DEFAULT_USER_PASSWORD;

		const existingUser = await this.users.findOne({
			where: { name: lowerName }
		});

		if (existingUser) return;

		const hashedPassword = await bcrypt.hash(password, 10);

		await this.users.create({
			name: name,
			password: hashedPassword,
			role: process.env.DEFAULT_ROLE,
			avatarUrl:
				'https://steamuserimages-a.akamaihd.net/ugc/1708538690062820758/000B5BFAFEA88146C04CC6C04630270AA2AD04D7/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
			telegramId: null,
			isTeamMember: true
		});
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

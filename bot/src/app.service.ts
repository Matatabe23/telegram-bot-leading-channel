import { Injectable } from '@nestjs/common';
import { RegularPublicationTime } from './module/db/models/regular-publication-time.repository';
import { Channels } from './module/db/models/channels.repository';
import { InjectModel } from '@nestjs/sequelize';
import { RolesSettings } from './module/db/models/roles-settings.repository';
import { ADVERTISEMENT_STATUS, PERMISSIONS_LIST } from './const/const';
import { EAdvertisementStatus, EPermissions, ISettingChannels } from 'src/types/types';

@Injectable()
export class AppService {
	constructor(
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings
	) {}

	async getMainInfo() {
		const listChannel = await this.channels.findAll({
			include: [
				{
					model: RegularPublicationTime
				}
			]
		});
		const listRoles = await this.rolesSettings.findAll();

		return {
			listChannel,
			listRoles,
			EPermissions,
			PERMISSIONS_LIST,
			ADVERTISEMENT_STATUS,
			ISettingChannels,
			EAdvertisementStatus
		};
	}

	getHello(): string {
		return 'Hello World!';
	}
}

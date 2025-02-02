import { Injectable } from '@nestjs/common';
import { RegularPublicationTime } from './module/db/models/regular-publication-time.repository';
import { Channels } from './module/db/models/channels.repository';
import { InjectModel } from '@nestjs/sequelize';
import { RolesSettings } from './module/db/models/roles-settings.repository';
import { ADVERTISEMENT_STATUS, PERMISSIONS_LIST } from './const/const';
import { EAdvertisementStatus, EPermissions, ESettingChannels } from 'src/types/types';

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
			data: {
				EPermissions,
				PERMISSIONS_LIST,
				EAdvertisementStatus,
				ADVERTISEMENT_STATUS,
				ESettingChannels
			}
		};
	}

	getHello(): string {
		return 'Hello World!';
	}
}

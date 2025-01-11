import { Column, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Users } from './users.repository';
import { Channels } from './channels.repository';
import { EAdvertisementStatus, ETypePostsAdvertisement } from 'src/types/types';

@Table
export class Advertisement extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	sourceChatId: number;

	@Column
	messageId: number;

	@Column
	publicationTime: Date;

	@Column
	moderationStatus: string;
	defaultValue = EAdvertisementStatus.CREATED;

	@Column({ type: 'json' })
	schedule: {
		type: ETypePostsAdvertisement;
		times: string[];
	};

	@ForeignKey(() => Users)
	@Column
	userId: number;

	@BelongsTo(() => Users)
	user: Users;

	@ForeignKey(() => Channels)
	@Column
	channelIds: number;

	@BelongsTo(() => Channels)
	channel: Channels;
}

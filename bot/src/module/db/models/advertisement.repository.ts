import { Column, ForeignKey, Model, Table, BelongsTo, DataType } from 'sequelize-typescript';
import { Users } from './users.repository';
import { EAdvertisementStatus } from 'src/types/types';

@Table
export class Advertisement extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	sourceChatId: number;

	@Column
	messageId: number;

	@Column
	moderationStatus: string;
	defaultValue = EAdvertisementStatus.CREATED;

	@Column({
		type: DataType.TEXT
	})
	schedule: string;

	@Column({
		type: DataType.TEXT
	})
	deleteMessageInfo: string;

	@ForeignKey(() => Users)
	@Column
	userId: number;

	@BelongsTo(() => Users)
	user: Users;
}

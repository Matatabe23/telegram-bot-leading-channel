import { Column, ForeignKey, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { Users } from './users.repository';
import { EAdvertisementStatus } from 'src/types/types';
import { AdvertisementSchedule } from './advertisement-schedule.repository'; // Импортируем модель AdvertisementSchedule

@Table
export class Advertisement extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ type: 'bigint' })
	sourceChatId: string;

	@Column
	messageId: number;

	@Column({ type: 'TEXT' })
	sourceMessage: string;

	@Column({ type: 'BIGINT' })
	messageGroupId?: string;

	@Column
	moderationStatus: string;
	defaultValue = EAdvertisementStatus.CREATED;

	@ForeignKey(() => Users)
	@Column
	userId: number;

	@BelongsTo(() => Users)
	user: Users;

	// Связь с таблицей AdvertisementSchedules (один ко многим)
	@HasMany(() => AdvertisementSchedule)
	schedules: AdvertisementSchedule[];
}

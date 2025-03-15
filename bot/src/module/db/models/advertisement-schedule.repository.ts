import { Column, ForeignKey, Model, Table, DataType, BelongsTo } from 'sequelize-typescript';
import { Advertisement } from './advertisement.repository'; // Импортируем модель Advertisement

@Table
export class AdvertisementSchedule extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => Advertisement)
	@Column
	advertisementId: number;

	@Column({ type: DataType.STRING(255), allowNull: false })
	publicationType: string;

	@Column({ type: DataType.DATE, allowNull: false })
	publicationTime: Date;

	@Column({ type: DataType.BIGINT, allowNull: false })
	sourceChatId: string;

	@Column({ type: DataType.DATE, allowNull: true })
	deleteTime: Date;

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		allowNull: false
	})
	createdAt: Date;

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		allowNull: false
	})
	updatedAt: Date;

	// Связь с таблицей Advertisement
	@BelongsTo(() => Advertisement)
	advertisement: Advertisement;
}

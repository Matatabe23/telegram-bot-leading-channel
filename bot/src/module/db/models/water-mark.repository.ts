import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Channels } from './channels.repository';
import { WaterMarkPosition } from 'src/types/types';

@Table
export class WaterMark extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	name: string; // Название водяного знака

	@Column
	imageUrl: string; // Ссылка на изображение водяного знака

	@Column({ allowNull: true })
	startDate: string; // Дата начала

	@Column({ allowNull: true })
	endDate: string; // Дата окончания

	@Column({ defaultValue: false })
	isDefault: boolean; // Признак дефолтного водяного знака

	@Column({ defaultValue: WaterMarkPosition.BOTTOM_RIGHT })
	position: WaterMarkPosition; // Положение водяного знака

	@ForeignKey(() => Channels)
	@Column
	channelId: number;

	@BelongsTo(() => Channels)
	channel: Channels;
}

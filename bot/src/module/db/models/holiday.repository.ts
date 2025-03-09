import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Tags } from './tags.repository';

@Table
export class Holiday extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column
	name: string;

	@Column
	startDate: string;

	@Column
	endDate: string;

	@ForeignKey(() => Tags)
	@Column
	tagId: number;

	@BelongsTo(() => Tags)
	tag: Tags;
}

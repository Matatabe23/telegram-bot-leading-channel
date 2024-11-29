import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class RolesSettings extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ unique: true })
	name: string;

	@Column
	permissions: string;
}

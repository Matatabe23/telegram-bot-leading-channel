import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { RolesSettings } from './roles-settings.repository';

@Table
export class Users extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ unique: true })
	name: string;

	@ForeignKey(() => RolesSettings)
	@Column
	role: string;

	@Column({ allowNull: true })
	avatarUrl: string;

	@Column({ allowNull: true })
	telegramId: string;

	@Column({ defaultValue: false })
	isTeamMember: boolean;

	@Column({ defaultValue: 0 })
	coin: number;
}

import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Users extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ unique: true })
	name: string;

	@Column({})
	password: string;

	@Column({})
	role: string;

	@Column({ allowNull: true })
	avatarUrl: string;

	@Column({ allowNull: true })
	telegramId: string;

	@Column({ defaultValue: false })
	isTeamMember: boolean;
}

import { Column, ForeignKey, BelongsTo, Model, Table, DataType } from 'sequelize-typescript';
import { Users } from './users.repository';

@Table
export class RefreshTokens extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@Column({ unique: true })
	token: string;

	@Column({
		type: DataType.DATE,
		allowNull: false
	})
	expiresAt: Date; // Срок действия токена

	@Column({ allowNull: true })
	ip: string; // IP-адрес, откуда вошли

	@Column({ allowNull: true })
	userAgent: string; // информация о браузере/устройстве

	@Column({ allowNull: true })
	device: string; // например "iPhone 14", "Windows Chrome"

	@ForeignKey(() => Users)
	@Column
	userId: number;

	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user: Users;
}

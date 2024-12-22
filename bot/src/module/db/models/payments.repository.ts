import { Column, ForeignKey, Model, Table, DataType } from 'sequelize-typescript';
import { Users } from './users.repository';

@Table
export class Payments extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	id: number;

	@ForeignKey(() => Users)
	@Column
	userId: number;

	@Column
	paymentId: string; // ID платежа от Юкассы

	@Column
	status: string; // Статус платежа (например, 'succeeded', 'pending', 'failed')

	@Column
	provider: string; // Провайдер платежа (например, Yookassa)

	@Column({ type: DataType.DECIMAL(10, 2) })
	amount: number; // Сумма платежа

	@Column
	currency: string; // Валюта платежа (например, RUB)

	@Column({ allowNull: true })
	description: string; // Описание платежа

	@Column({ type: DataType.JSON, allowNull: true })
	paymentData: object; // Полные данные ответа от Юкассы (если нужно)

	@Column({ defaultValue: false })
	refunded: boolean; // Флаг, если платеж был возвращен

	@Column({ type: DataType.DATE })
	createdAt: Date;

	@Column({ type: DataType.DATE, allowNull: true })
	refundedAt: Date;
}

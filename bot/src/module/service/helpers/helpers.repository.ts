import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EPermissions } from 'src/types/types';
import { Payments } from 'src/module/db/models/payments.repository';
import { RolesSettings } from 'src/module/db/models/roles-settings.repository';

@Injectable()
export class HelpersRepository {
	constructor(
		@InjectModel(RolesSettings)
		private readonly rolesSettings: typeof RolesSettings,
		@InjectModel(Payments)
		private readonly payments: typeof Payments
	) {}

	async checkPermissions(role: string, permission: EPermissions) {
		const requiredPermissions = await this.rolesSettings.findOne({ where: { name: role } });
		if (requiredPermissions?.permissions) {
			return requiredPermissions?.permissions.includes(permission);
		}
		return false;
	}

	async savePaymentData(payment: {
		userId: number;
		paymentId: string;
		status: string;
		provider: string;
		amount: number;
		currency: string;
		paymentData: any;
	}) {
		try {
			await this.payments.create({
				userId: payment.userId,
				paymentId: payment.paymentId,
				status: payment.status,
				amount: payment.amount,
				provider: payment.provider,
				currency: payment.currency,
				paymentData: payment.paymentData,
				createdAt: new Date()
			});
		} catch (error) {
			console.error('Ошибка при сохранении данных о платеже:', error);
		}
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { priceList } from 'src/const/const';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/module/db/models/users.repository';
import { HelpersRepository } from '../../helpers/helpers.repository';

@Injectable()
export class YuKassaRepository {
	public bot: TelegramBot;

	constructor(
		private readonly tgBotService: TGBotService,
		private readonly helpersRepository: HelpersRepository,
		@InjectModel(Users)
		private readonly users: typeof Users
	) {
		this.bot = this.tgBotService.getBot();
	}

	async pay(userId: number) {
		if (!process.env.YOOKASSA_API_KEY)
			throw new HttpException('Ошибка сервиса оплаты', HttpStatus.UNAUTHORIZED);

		this.bot.removeListener('callback_query');
		this.bot.removeListener('successful_payment');
		this.bot.removeListener('pre_checkout_query');

		const paragraphs = [
			'Стоимость рекламы может меняться в зависимости от сезона и количества подписчиков в каналах'
		];
		const paymentInfoMessage = await this.bot.sendMessage(userId, paragraphs.join('\n\n'));
		const message1 = await this.bot.sendMessage(userId, `Ты готов к покупке?`, priceList);

		this.bot.on('callback_query', async (msg: TelegramBot.CallbackQuery) => {
			try {
				const data = msg.data;
				this.bot.deleteMessage(msg.from.id, message1.message_id);
				await this.bot.sendInvoice(
					userId,
					'Покупка coin',
					'Валюта которая используется для покупки рекламы',
					'invoice',
					process.env.YOOKASSA_API_KEY,
					'RUB',
					[
						{
							label: 'RUB',
							amount: +data
						}
					],
					{
						provider_data: {
							UserId: userId
						}
					}
				);
			} catch (e) {
				console.error('Ошибка при подтверждении платежа:', e);
			}
		});

		this.bot.on('successful_payment', async (msg: TelegramBot.Message) => {
			const userId = msg.from.id;
			const selectedPrice = msg.successful_payment.total_amount / 100;

			const userData = await this.users.findOne({ where: { telegramId: userId } });
			if (!userData) {
				this.bot.sendMessage(userId, 'Пользователь не найден в системе.');
				return;
			}

			await this.users.update(
				{ coin: userData.coin + selectedPrice },
				{ where: { id: userData.id } }
			);

			await this.helpersRepository.savePaymentData({
				userId: userData.id,
				paymentId: msg.successful_payment.provider_payment_charge_id,
				status: 'succeeded',
				provider: 'YooKassa',
				amount: selectedPrice,
				currency: 'RUB',
				paymentData: msg.successful_payment
			});

			this.bot.sendMessage(userId, 'Успешное пополнение!');
			this.bot.deleteMessage(userId, paymentInfoMessage.message_id);
		});

		this.bot.on('pre_checkout_query', async (msg: TelegramBot.PreCheckoutQuery) => {
			try {
				await this.bot.answerPreCheckoutQuery(msg.id, true);
			} catch (error) {
				console.error('Ошибка при подтверждении платежа:', error);
				await this.bot.answerPreCheckoutQuery(msg.id, false, error.message);
			}
		});
	}
}

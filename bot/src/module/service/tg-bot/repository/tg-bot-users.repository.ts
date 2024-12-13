import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';
import { Users } from 'src/module/db/models/users.repository';

import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';

@Injectable()
export class TGBotUsersRepository {
	public bot: TelegramBot;

	constructor(
		private readonly tgBotService: TGBotService,
		@InjectModel(Users)
		private readonly users: typeof Users
	) {
		this.bot = this.tgBotService.getBot();
	}

	public async requestLoginConfirmation(chatId: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Отправляем сообщение с кнопками подтверждения
			this.bot
				.sendMessage(chatId, 'Подтвердите вход в систему:', {
					reply_markup: {
						inline_keyboard: [
							[
								{ text: 'Подтвердить', callback_data: 'confirm' },
								{ text: 'Отказать', callback_data: 'deny' }
							]
						]
					}
				})
				.then((sentMessage) => {
					const messageId = sentMessage.message_id;

					// Обрабатываем выбор пользователя
					const callbackHandler = async (callbackQuery: TelegramBot.CallbackQuery) => {
						if (callbackQuery.message?.chat.id === chatId) {
							const action = callbackQuery.data;

							if (action === 'confirm') {
								this.bot.answerCallbackQuery(callbackQuery.id, {
									text: 'Вход подтверждён'
								});
								this.bot.deleteMessage(chatId, String(messageId));
								this.bot.removeListener('callback_query', callbackHandler);
								resolve(true);
							} else if (action === 'deny') {
								this.bot.answerCallbackQuery(callbackQuery.id, {
									text: 'Вход отклонён'
								});
								this.bot.deleteMessage(chatId, String(messageId));
								this.bot.removeListener('callback_query', callbackHandler);
								resolve(false);
							} else {
								this.bot.answerCallbackQuery(callbackQuery.id, {
									text: 'Неизвестное действие'
								});
							}
						}
					};

					this.bot.on('callback_query', callbackHandler);

					// Устанавливаем тайм-аут на случай отсутствия ответа
					setTimeout(() => {
						this.bot.removeListener('callback_query', callbackHandler);
						this.bot.deleteMessage(chatId, String(messageId));
						reject(new Error('Ответ от пользователя не получен в установленное время'));
					}, 60000);
				});
		});
	}

	public async ensureUserExists(telegramId: number, name: string) {
		const user = await this.users.findOne({ where: { telegramId } });

		if (!user) {
			const userCount = await this.users.count();

			await this.users.create({
				name,
				role: userCount === 0 ? process.env.DEFAULT_ROLE : null,
				avatarUrl: 'https://api.dicebear.com/9.x/bottts/svg',
				telegramId,
				isTeamMember: userCount === 0
			});
		}
	}
}

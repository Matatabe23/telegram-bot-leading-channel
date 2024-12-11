import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';

import { createTelegramBot } from 'src/config/telegram.config';

import { FileRepository } from 'src/module/service/files/files.repository';
import { S3Repository } from 'src/module/service/s3/s3.repository';

import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { ImageData } from 'src/module/db/models/image-data.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';

import { WaterMarkRepository } from '../water-mark/water-mark.repository';
import { Users } from 'src/module/db/models/users.repository';

@Injectable()
export class TGBotService {
	private readonly logger = new Logger(TGBotService.name);
	public bot: TelegramBot;

	constructor(
		@InjectModel(Users)
		private readonly users: typeof Users,
		@InjectModel(DataBasePosts)
		private readonly dataBasePosts: typeof DataBasePosts,
		@InjectModel(ImageData)
		private readonly imageData: typeof ImageData,
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		@InjectModel(ChannelPosts)
		private readonly channelPosts: typeof ChannelPosts,
		private readonly fileRepository: FileRepository,
		private readonly s3Repository: S3Repository,
		private readonly waterMarkRepository: WaterMarkRepository
	) {
		this.bot = createTelegramBot();
		this.initializeMessageHandlers();
	}

	private initializeMessageHandlers() {
		this.bot.on('message', async (msg: TelegramBot) => {
			const chatId = msg.chat.id;
			const text = msg.text;
			console.log(msg);

			this.logger.log(`Получено сообщение из чата ${chatId}: ${text}`);
			console.log(msg);

			try {
				await this.ensureUserExists(msg.from.id, msg.from.username);

				if (text) {
					await this.handleTextMessage(chatId, text);
				}
			} catch (error) {
				this.logger.error('Ошибка при обработке сообщения:', error);
			}
		});
	}

	private async handleTextMessage(chatId: number, text: string) {
		// Пример обработки текста
		if (text.toLowerCase().includes('/start')) {
			await this.bot.sendMessage(chatId, 'Привет! Я Милана, чем могу помочь?');
		} else {
			await this.bot.sendMessage(chatId, 'Не понимаю');
		}
	}

	private async ensureUserExists(telegramId: number, name: string) {
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

	async sendMessageAtScheduledTime(timeData: { time: Date; chatId: string }) {
		const postWithImages = await this.dataBasePosts.findOne({
			include: [
				{
					model: Channels,
					where: { chatId: timeData.chatId },
					required: true
				},
				{ model: ImageData }
			],
			order: [['id', 'ASC']]
		});

		const chatInfo = await this.channels.findOne({
			where: { chatId: timeData.chatId }
		});

		if (!postWithImages) return;

		const media = [];
		for (const item of postWithImages.dataValues.images) {
			try {
				const result = await this.fileRepository.downloadFile(
					`${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`
				);

				const mediaBuffer = postWithImages.waterMark
					? await this.waterMarkRepository.addWatermark(result)
					: result;

				media.push({
					type: 'photo',
					media: mediaBuffer.buffer,
					id: item.id,
					caption: '#QugorArts'
				});
			} catch (error) {
				this.logger.error('Ошибка при скачивании файла из S3:', error);
				return;
			}
		}

		if (media.length > 10) {
			this.logger.error('Слишком много медиафайлов');
			return;
		}

		const deletePost = async () => {
			const channelPosts = await this.channelPosts.findAll({
				where: {
					postId: postWithImages.dataValues.id
				}
			});

			if (channelPosts.length > 1) {
				await this.channelPosts.destroy({
					where: {
						channelId: chatInfo.dataValues.id,
						postId: postWithImages.dataValues.id
					}
				});
			} else {
				await Promise.all(
					postWithImages.dataValues.images.map(async (item: any) => {
						await this.imageData.destroy({ where: { id: item.id } });
						this.s3Repository.deleteImageFromS3(item.image);
					})
				);
				await this.channelPosts.destroy({ where: { postId: postWithImages.id } });
				await this.dataBasePosts.destroy({ where: { id: postWithImages.id } });
			}
		};

		if (postWithImages.dataValues.channels.length > 0) {
			for (const element of postWithImages.dataValues.channels) {
				if (element.chatId) {
					await this.bot
						.sendMediaGroup(element.chatId as string, media)
						.then(() => deletePost());
				}
			}
		}
	}

	async instantPublicationPosts(files: any, chatId: string, waterMark?: boolean) {
		return new Promise(async (resolve, reject) => {
			const media: any = [];
			if (files.length > 10) {
				console.error('Слишком много медиафайлов');
				reject(new Error('Слишком много медиафайлов'));
				return;
			}

			for (const file of files) {
				const mediaBuffer = waterMark
					? await this.waterMarkRepository.addWatermark(file)
					: file;

				const mediaBlock = {
					type: 'photo',
					media: mediaBuffer.buffer,
					caption: '#QugorArts'
				};
				media.push(mediaBlock);
			}

			try {
				await this.bot.sendMediaGroup(chatId as string, media);
				resolve(true);
			} catch (error: any) {
				console.error('Ошибка при отправке сообщения:', error);
				reject(error);
			}
		});
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
}

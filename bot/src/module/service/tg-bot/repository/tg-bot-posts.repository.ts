import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as TelegramBot from 'node-telegram-bot-api';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';

import { TGBotService } from 'src/module/service/tg-bot/tg-bot.service';
import { FileRepository } from '../../files/files.repository';
import { S3Repository } from '../../s3/s3.repository';
import { WaterMarkRepository } from '../../water-mark/water-mark.repository';
import { Users } from 'src/module/db/models/users.repository';
import { ImageData } from 'src/module/db/models/image-data.repository';

@Injectable()
export class TGBotPostsRepository {
	private readonly logger = new Logger(TGBotPostsRepository.name);
	public bot: TelegramBot;

	constructor(
		private readonly tgBotService: TGBotService,
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
		this.bot = this.tgBotService.getBot();
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
						const bucketBaseUrl = `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}`;
						this.s3Repository.deleteImageFromS3(`${bucketBaseUrl}/${item.image}`);
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
}

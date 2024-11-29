import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { FileRepository } from 'src/module/service/file-service/file-service.repository';
import { S3Repository } from 'src/module/service/s3-service/s3-service.repository';

import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { ImageData } from 'src/module/db/models/image-data.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';

import { WaterMarkRepository } from '../water-mark-service/water-mark-service.repository';

import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TGBotService {
	private readonly logger = new Logger(TGBotService.name);
	public bot: TelegramBot;

	constructor(
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
		this.bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, {
			polling: true
		});
	}

	async sendMessageAtScheduledTime(timeData: { time: Date; chatId: string }) {
		const postWithImages: any = await this.dataBasePosts.findOne({
			include: [
				{
					model: Channels as any,
					where: { chatId: timeData.chatId },
					required: true
				},
				{ model: ImageData }
			],
			order: [['id', 'ASC']]
		});
		console.log(postWithImages);

		if (!postWithImages) return;

		const media: any = [];
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

		const deleteImage = async () => {
			await Promise.all(
				postWithImages.dataValues.images.map(async (item: any) => {
					await this.imageData.destroy({ where: { id: item.id } });
					this.s3Repository.deleteImageFromS3(item.image);
				})
			);
			await ChannelPosts.destroy({ where: { postId: postWithImages.id } });
			await this.dataBasePosts.destroy({ where: { id: postWithImages.id } });
		};

		if (postWithImages.dataValues.channels.length > 0) {
			for (const element of postWithImages.dataValues.channels) {
				if (element.chatId) {
					await this.bot
						.sendMediaGroup(element.chatId as string, media)
						.then(() => deleteImage());
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

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

import { FileRepository } from 'src/module/service/file-service/file-service.repository';
import { S3Repository } from 'src/module/service/s3-service/s3-service.repository';

import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { ImageData } from 'src/module/db/models/imageData.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';

import * as TelegramBot from 'node-telegram-bot-api';

import { waterMark } from 'src/const/const';

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
    private readonly configService: ConfigService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, {
      polling: true,
    });
  }

  async sendMessageAtScheduledTime(timeData: { time: Date; chatId: string }) {
    const postWithImages: any = await this.dataBasePosts.findOne({
      include: [
        {
          model: Channels as any,
          where: { chatId: timeData.chatId },
          required: true,
        },
        { model: ImageData },
      ],
      order: [['id', 'ASC']],
    });

    if (!postWithImages) return;

    const media: any = [];

    for (const item of postWithImages.imageData) {
      let filePath: any = '';
      try {
        const result = await this.fileRepository.downloadFile(
          `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`,
        );
        filePath = result;

        media.push({
          type: 'photo',
          media: fs.createReadStream(filePath),
          id: item.id,
          caption: '#QugorArts',
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
      const deletePromises = postWithImages.imageData.map((file) =>
        this.fileRepository.deleteLocalFile(
          file.dataValues.image.split('/').pop(),
        ),
      );
      await Promise.all(deletePromises);

      await Promise.all(
        postWithImages.imageData.map(async (item: any) => {
          await this.imageData.destroy({ where: { id: item.id } });
          this.s3Repository.deleteImageFromS3(item.image);
        }),
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

  async instantPublicationPosts(
    files: any,
    chatId: string,
    stringArray?: boolean,
  ) {
    return new Promise(async (resolve, reject) => {
      const media: any = [];

      for (const file of files) {
        let filePath: any = '';

        if (stringArray) {
          try {
            const result = await this.fileRepository.downloadFile(file);
            filePath = result;
          } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
            reject(error);
            return;
          }
        } else {
          filePath = file.path;
        }

        const mediaBlock = {
          type: 'photo',
          media: fs.createReadStream(filePath),
          caption: waterMark,
        };
        media.push(mediaBlock);
      }

      if (media.length > 10) {
        console.error('Слишком много медиафайлов');
        reject(new Error('Слишком много медиафайлов'));
        return;
      }

      try {
        await this.bot.sendMediaGroup(chatId as string, media);
        const deletePromises = files.map((file) =>
          this.fileRepository.deleteLocalFile(
            stringArray ? file.split('/').pop() : file.path.split('\\').pop(),
          ),
        );
        await Promise.all(deletePromises);

        resolve(true);
      } catch (error: any) {
        console.error('Ошибка при отправке сообщения:', error);
        reject(error);
      }
    });
  }
}

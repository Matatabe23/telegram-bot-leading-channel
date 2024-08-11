import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ImageData } from 'src/module/db/models/imageData.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';
import { WaterMarkRepository } from 'src/module/service/water-mark-service/water-mark-service.repository';
import { S3Repository } from 'src/module/service/s3-service/s3-service.repository';
import { TGBotService } from 'src/module/service/tg-bot-service/tg-bot-service.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(DataBasePosts)
    private readonly dataBasePosts: typeof DataBasePosts,
    @InjectModel(ImageData)
    private readonly imageData: typeof ImageData,
    @InjectModel(Channels)
    private readonly channels: typeof Channels,
    @InjectModel(ChannelPosts)
    private readonly channelPosts: typeof ChannelPosts,
    private readonly waterMarkRepository: WaterMarkRepository,
    private readonly s3Repository: S3Repository,
    private readonly tGBotService: TGBotService,
  ) {}

  async publication(files: any, waterMark: boolean, chatIdList: string[]) {
    if (chatIdList.length === 0 && chatIdList[0] === '')
      throw new Error('Нету каналов для публикации');

    const post = await this.dataBasePosts.create();
    const postId = post.dataValues.id;

    const chatIds = await Promise.all(
      chatIdList.map(async (chatId) => {
        return await this.channels.findOne({
          where: {
            chatId: chatId,
          },
        });
      }),
    );
    const chatId = chatIds.map((item) => item?.dataValues.id);

    for (const file of files) {
      let url: string;
      if (waterMark === true) {
        await this.waterMarkRepository.addWatermark(file);
        url = await this.s3Repository.uploadImageToS3(file, postId);
      } else {
        url = await this.s3Repository.uploadImageToS3(file, postId);
      }

      await this.imageData.create({
        image: url,
        dataBasePostId: postId,
      });

      this.editPostLinkСhannels(postId, chatId);
    }

    return 'Успешное сохранение в базу данных!';
  }

  async editPostLinkСhannels(postId: number, channelIds?: number[]) {
    if (!postId || !Array.isArray(channelIds)) {
      throw new Error('Неверный формат параметров запроса');
    }

    const existingRecords = await this.channelPosts.findAll({
      where: { postId },
    });

    const existingChannelIds = existingRecords.map(
      (record: any) => record.channelId,
    );

    const idsToDelete = existingChannelIds.filter(
      (id) => !channelIds.includes(id),
    );
    const idsToAdd = channelIds.filter(
      (id) => !existingChannelIds.includes(id),
    );

    if (idsToDelete.length > 0) {
      idsToDelete.forEach(async (element) => {
        await this.channelPosts.destroy({
          where: {
            postId,
            channelId: element,
          },
        });
      });
    }

    if (idsToAdd.length > 0) {
      idsToAdd.forEach(async (element) => {
        await this.channelPosts.create({
          postId,
          channelId: element,
          dataBasePostId: postId,
        });
      });
    }

    return 'Успешное изменение!';
  }

  async instantPublicationPosts(
    files: any,
    waterMark: boolean,
    chatIdList: string[],
  ) {
    if (chatIdList.length === 0 && chatIdList[0] === '')
      throw new Error('Нету каналов для публикации');

    if (waterMark === true) {
      for (const file of files) {
        await this.waterMarkRepository.addWatermark(file);
      }

      for (const chatId of chatIdList) {
        await this.tGBotService.instantPublicationPosts(files, chatId);
      }
      return 'Успешная моментальная публикация';
    }

    for (const chatId of chatIdList) {
      await this.tGBotService.instantPublicationPosts(files, chatId);
    }
    return 'Успешная моментальная публикация';
  }
}

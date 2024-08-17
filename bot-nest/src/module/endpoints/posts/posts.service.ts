import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ImageData } from 'src/module/db/models/imageData.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';
import { WaterMarkRepository } from 'src/module/service/water-mark-service/water-mark-service.repository';
import { S3Repository } from 'src/module/service/s3-service/s3-service.repository';
import { TGBotService } from 'src/module/service/tg-bot-service/tg-bot-service.repository';
import { IImageBlock } from 'src/type/types';
import { RegularPublicationTime } from 'src/module/db/models/regularPublicationTime.repository';
import { Op, Order } from 'sequelize';
import { FileRepository } from 'src/module/service/file-service/file-service.repository';

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
    @InjectModel(RegularPublicationTime)
    private readonly regularPublicationTime: typeof RegularPublicationTime,
    private readonly waterMarkRepository: WaterMarkRepository,
    private readonly s3Repository: S3Repository,
    private readonly tGBotService: TGBotService,
    private readonly fileRepository: FileRepository,
  ) {}

  async publication(files: any, waterMark: boolean, chatIdList: string[]) {
    if (chatIdList.length === 0 || chatIdList[0] === '')
      throw new NotFoundException('Нету каналов для публикации');

    const post = await this.dataBasePosts.create({
      waterMark,
    });
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
      const url = await this.s3Repository.uploadImageToS3(file, postId);

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
      throw new NotFoundException('Неверный формат параметров запроса');
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
            channelId: element,
            postId: postId,
          },
        });
      });
    }

    if (idsToAdd.length > 0) {
      idsToAdd.forEach(async (element) => {
        await this.channelPosts.create({
          channelId: element,
          postId: postId,
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
      throw new NotFoundException('Нету каналов для публикации');

    if (waterMark === true) {
      const imagesFromWaterMark = await Promise.all(
        files.map(async (item) => {
          return this.waterMarkRepository.addWatermark(item);
        }),
      );

      for (const chatId of chatIdList) {
        await this.tGBotService.instantPublicationPosts(
          imagesFromWaterMark,
          chatId,
        );
      }
      return 'Успешная моментальная публикация';
    }

    for (const chatId of chatIdList) {
      await this.tGBotService.instantPublicationPosts(files, chatId);
    }
    return 'Успешная моментальная публикация';
  }

  async receiving(
    page: number,
    pageSize: number,
    watched: string,
    channel: string,
  ) {
    if (isNaN(page) || isNaN(pageSize)) {
      throw new NotFoundException('Неверный формат параметров запроса');
    }

    const offset = (page - 1) * pageSize;

    let whereCondition: {
      watched?: boolean;
    } = {};
    if (watched === 'watched') {
      whereCondition = { ...whereCondition, watched: true };
    } else if (watched === 'unwatched') {
      whereCondition = { ...whereCondition, watched: false };
    }

    const posts = await this.dataBasePosts.findAll({
      include: [
        {
          model: ImageData,
          limit: 1,
        },
        {
          model: Channels,
          through: { attributes: [] },
          where: channel ? { id: channel } : undefined,
        },
      ],
      limit: Number(pageSize),
      offset: offset,
      where: whereCondition,
    });

    const updatedPosts = posts.map((post) => {
      post.dataValues.imageData = post.dataValues.images.map((img) => {
        img.image = `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${img.dataValues.image}`;
        return img;
      });
      return post;
    });

    const list = await this.regularPublicationTime.findAll();
    const totalCount = await this.dataBasePosts.count({
      where: whereCondition,
      include: [
        {
          model: Channels,
          through: { attributes: [] },
          where: channel ? { id: channel } : undefined,
        },
      ],
    });

    return { posts: updatedPosts, totalCount, publishTime: list };
  }

  async deletePost(id: number) {
    const post = await this.dataBasePosts.findByPk(id);
    if (!post) {
      throw new NotFoundException('Пост не найден');
    }
    const images = await this.imageData.findAll({
      where: { dataBasePostId: id },
    });
    const imageList = images.map((item) => {
      return `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`;
    });

    await ChannelPosts.destroy({ where: { postId: id } });

    for (const image of imageList) {
      this.s3Repository.deleteImageFromS3(image);
    }

    await this.imageData.destroy({ where: { dataBasePostId: id } });

    await post.destroy();

    return 'Пост успешно удален';
  }

  async publishInstantly(id: number) {
    const post = await this.dataBasePosts.findOne({
      where: {
        id: id,
      },
      include: [{ model: Channels }, { model: ImageData }],
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    if (post.dataValues.channels.length === 0)
      throw new NotFoundException('Нету каналов для публикации');

    const images = await this.imageData.findAll({
      where: { dataBasePostId: id },
    });

    const deletePost = async () => {
      await ChannelPosts.destroy({ where: { postId: id } });
      await this.imageData.destroy({ where: { dataBasePostId: id } });

      await post.destroy();

      for (const image of images) {
        await this.s3Repository.deleteImageFromS3(image.dataValues.image);
      }
    };

    const files = [];

    for (const image of images) {
      const result = await this.fileRepository.downloadFile(
        `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${image.dataValues.image}`,
      );

      files.push(result);
    }

    for (const element of post.dataValues.channels) {
      await this.tGBotService.instantPublicationPosts(
        files,
        element.chatId,
        post.dataValues.waterMark,
      );
    }
    await deletePost();

    return 'Пост успешно опубликован';
  }

  async receivingPost(id: number) {
    const post = await this.dataBasePosts.findByPk(id, {
      include: [{ model: Channels }, { model: ImageData }],
    });

    const channelsList = await this.channels.findAll();

    if (!post) throw new NotFoundException('Пост не найден');

    const imageList = post.dataValues.images.map((item) => {
      return {
        id: item.dataValues.id,
        img: `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`,
        dataBasePostId: item.dataValues.dataBasePostId,
      };
    });

    await post.update({ watched: true });

    return { imageList, channelsPost: post.dataValues.channels, channelsList };
  }

  async changePage(id: number, where: string, watched: string) {
    let whereCondition: {
      watched?: boolean;
    } = {};
    if (watched === 'watched') {
      whereCondition = { ...whereCondition, watched: true };
    } else if (watched === 'unwatched') {
      whereCondition = { ...whereCondition, watched: false };
    }

    const condition =
      where === 'next'
        ? { id: { [Op.gt]: id } }
        : where === 'back'
          ? { id: { [Op.lt]: id } }
          : {};

    const order: Order =
      where === 'next'
        ? [['id', 'ASC']]
        : where === 'back'
          ? [['id', 'DESC']]
          : [['id', 'ASC']];

    const post = await this.dataBasePosts.findOne({
      include: [{ model: Channels }, { model: ImageData }],
      where: {
        ...condition,
        ...whereCondition,
      },
      order: order,
    });

    const channelsList = await this.channels.findAll();

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    const images = await this.imageData.findAll({
      where: { dataBasePostId: post.dataValues.id },
    });
    const imageList = images.map((item) => {
      return {
        id: item.dataValues.id,
        img: `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`,
        dataBasePostId: item.dataValues.dataBasePostId,
      };
    });

    await post.update({ watched: true });

    return {
      postId: post.dataValues.id,
      imageList,
      channelsPost: post.dataValues.channels,
      channelsList,
    };
  }

  async deleteSelectedImgs(idList: IImageBlock[]) {
    for (const element of idList) {
      const post = await this.imageData.findByPk(element.id);
      if (post) {
        await this.s3Repository.deleteImageFromS3(post.dataValues.image);
        await this.imageData.destroy({ where: { id: post.dataValues.id } });
      }
    }

    return 'Фото удалены';
  }
}

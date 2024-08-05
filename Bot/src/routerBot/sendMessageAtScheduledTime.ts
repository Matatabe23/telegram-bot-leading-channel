import { dataBasePosts, imageData, channels, ChannelPosts } from '../models/models.js';
import { bot } from '../routerBot/index.js';
import { deleteImageFromS3 } from '../service/s3-service.js';
import { S3_BUCKET_NAME, S3_PATH } from '../const/constENV.js';
import fs from 'fs';
import { downloadFile, deleteLocalFile } from '../utils/downloadFile.js';

export default async function sendMessageAtScheduledTime() {
  const postWithImages: any = await dataBasePosts.findOne({
    order: [['id', 'ASC']],
    include: [
      { model: channels },
      { model: imageData }
    ]
  });

  if (!postWithImages) return;

  const media: any = [];

  for (const item of postWithImages.imageData) {
    let filePath: any = '';
    try {
      const result = await downloadFile(`${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`);
      filePath = result;

      media.push({
        type: 'photo',
        media: fs.createReadStream(filePath),
        id: item.id,
        caption: '#QugorArts'
      });
    } catch (error) {
      console.error('Ошибка при скачивании файла из S3:', error);
      return;
    }
  }

  if (media.length > 10) {
    console.error('Слишком много медиафайлов');
    return;
  }

  const deleteImage = async () => {
    const deletePromises = postWithImages.imageData.map(file => deleteLocalFile(file.dataValues.image.split('/').pop()));
    await Promise.all(deletePromises);

    await Promise.all(
      postWithImages.imageData.map(async (item: any) => {
        await imageData.destroy({ where: { id: item.id } });
        deleteImageFromS3(item.image);
      })
    );
    await ChannelPosts.destroy({ where: { postId: postWithImages.id } });
    await dataBasePosts.destroy({ where: { id: postWithImages.id } });
  }

  if (postWithImages.dataValues.channels.length > 0) {
    for (const element of postWithImages.dataValues.channels) {
      if (element.chatId) {
        await bot.sendMediaGroup(element.chatId as string, media).then(() => deleteImage())
      }
    }
  } else {
    const channelsList = await channels.findAll()
    const defaultChannel = channelsList.find(item => item.dataValues.settings.includes('defaultChannels'))
    await bot.sendMediaGroup(defaultChannel?.dataValues.chatId, media).then(() => deleteImage())
  }
}

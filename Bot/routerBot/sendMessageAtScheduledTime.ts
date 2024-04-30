const { dataBasePost, imageData } = require('../models/models')
import {bot} from '../routerBot/index'
import {deleteImageFromS3} from '../service/s3-service'

export async function sendMessageAtScheduledTime() {
  const postWithImages = await dataBasePost.findOne({
    order: [['id', 'ASC']],
    include: imageData
  });

  if (!postWithImages) return;

  const media = postWithImages.imageData.map((item: any) => {
    return {
      type: 'photo',
      media: item.image,
      id: item.id
    }
  });

  const postId = postWithImages.id;

  if (media.lenght > 10) {
    console.error('Слишком много медиафайлов');
    return
  }

  bot.sendMediaGroup(process.env.CHAT_ID_DEV, media)
    .then(async () => {
      media.map(async (item: any) => {
        await imageData.destroy({
          where: { id: item.id },
        });

        deleteImageFromS3(item.media);
      });
      await dataBasePost.destroy({
        where: { id: postId },
      });
    })
    .catch((error: any) => {
      console.error('Ошибка при отправке сообщения:', error);
    });
};

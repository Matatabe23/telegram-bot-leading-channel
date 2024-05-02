import { dataBasePost, imageData } from '../models/models.js';
import { bot } from '../routerBot/index.js';
import { deleteImageFromS3 } from '../service/s3-service.js';
import { CHAT_ID_DEV } from '../const/constENV.js';

export default async function sendMessageAtScheduledTime() {
  const postWithImages: any = await dataBasePost.findOne({
    order: [['id', 'ASC']],
    include: imageData
  });

  if (!postWithImages) return;

  const media = postWithImages.imageData.map((item: any) => {
    return {
      type: 'photo',
      media: item.image,
      id: item.id,
      caption: '#QugorArts'
    };
  });

  const postId = postWithImages.id;

  if (media.length > 10) {
    console.error('Слишком много медиафайлов');
    return;
  }

  if (CHAT_ID_DEV) {
    bot.sendMediaGroup(CHAT_ID_DEV, media)
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
      .catch((error: Error) => {
        console.error('Ошибка при отправке сообщения:', error);
      });
  }
}

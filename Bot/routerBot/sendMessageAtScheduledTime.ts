const { msUntilNextTargetTime } = require('../utilities/timeUntilNextTimer');
const { dataBasePost, imageData } = require('../models/models')
const { publishTime } = require('../const');
import { IpublishTime } from '../types'

export async function sendMessageAtScheduledTime(bot: any) {
  async function scheduleNextMessage(time: IpublishTime) {
    setTimeout(async () => {
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
      
      bot.sendMediaGroup(process.env.CHAT_ID_DEV, media)
        .then(async () => {
          media.map(async (item:any) => {
            await imageData.destroy({
              where: { id: item.id },
            });
          });
          await dataBasePost.destroy({
            where: { id: postId },
          });
          scheduleNextMessage(time);
        })
        .catch((error: any) => {
          console.error('Ошибка при отправке сообщения:', error);
          scheduleNextMessage(time);
        });
    }, msUntilNextTargetTime(time.hour, time.minute));
  }
  
  for (const time of publishTime) {
    await scheduleNextMessage(time);
  }
}
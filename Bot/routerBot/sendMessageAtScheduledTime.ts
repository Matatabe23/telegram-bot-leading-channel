const { msUntilNextTargetTime } = require('../utilities/timeUntilNextTimer');
const { dataBasePost, imageData } = require('../models/models')
const { publishTime } = require('../const');
import { IpublishTime } from '../page-constructor.i'

export function sendMessageAtScheduledTime(bot: any) {
  publishTime.forEach(async (time: IpublishTime) => {
    const postWithImages = await dataBasePost.findOne({
      order: [['id', 'ASC']], // Сортировка по возрастанию id
      include: imageData
    });
    if (!postWithImages) return

    const media = postWithImages.imageData.map((item: any) => {
      return {
        type: 'photo',
        media: item.image
      }
    })
    const postId = postWithImages.id

    setTimeout(() => {
      bot.sendMediaGroup(process.env.CHAT_ID_DEV, media)
        .then(async () => {
          sendMessageAtScheduledTime(bot);
        })
        .catch((error: any) => {
          console.error('Ошибка при отправке сообщения:', error);
          sendMessageAtScheduledTime(bot);
        });
    }, msUntilNextTargetTime(time.hour, time.minute));
  });
}
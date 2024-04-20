const TelegramBot = require('node-telegram-bot-api');
const { msUntilNextTargetTime } = require('../utilities/timeUntilNextTimer');
const { publishTime } = require('../const');
import { IpublishTime } from '../page-constructor.i'
const {dataBasePost, imageData} = require('../models/models')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true });
const message = 'Сообщение, которое будет отправлено в указанное время';

async function sendMessageAtScheduledTime(hour: number, minute: number) {
  const postWithImages = await dataBasePost.findOne({
    order: [['id', 'ASC']], // Сортировка по возрастанию id
    include: imageData
  });
  
  if(!postWithImages) return

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
        const post = await dataBasePost.findByPk(postId);
        await post.destroy({ cascade: true });
        sendMessageAtScheduledTime(hour, minute);
      })
      .catch((error: any) => {
        console.error('Ошибка при отправке сообщения:', error);
        sendMessageAtScheduledTime(hour, minute);
      });
  }, msUntilNextTargetTime(hour, minute));
}

publishTime.forEach((time: IpublishTime) => {
  sendMessageAtScheduledTime(time.hour, time.minute);
});
import { bot } from './index.js';
import fs from 'fs';

export async function instantPublicationPosts(files: any) {
  const media: any = [];
  for (const file of files) {
    const mediaBlock = {
      type: 'photo',
      media: fs.readFileSync(file.path),
      caption: '#QugorArts'
    };
    media.push(mediaBlock);

    fs.unlink(`${file.destination}${file.filename}`, (err) => {
      if (err) {
        console.error('Ошибка при удалении файла:', err);
      } else {
        console.log('Файл успешно удален:', file.path);
      }
    });
  }

  if (media.length > 10) {
    console.error('Слишком много медиафайлов');
    return;
  }

  if (process.env.CHAT_ID_DEV) {
    try {
      bot.sendMediaGroup(process.env.CHAT_ID_DEV, media)
        .then(async () => {
          // console.log()
        })
        .catch((error: Error) => {
          console.error('Ошибка при отправке сообщения:', error);
        });
    } catch (e) {
      console.log(e);
    }
  }

}

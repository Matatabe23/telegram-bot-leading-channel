import { bot } from './index.js';
import fs from 'fs';
import { waterMark } from '../const/const.js';
import { CHAT_ID } from '../const/constENV.js';

export async function instantPublicationPosts(files: any, stringArray?: boolean) {
  return new Promise((resolve, reject) => {
    const media: any = [];
    for (const file of files) {
      const mediaBlock = {
        type: 'photo',
        media: stringArray ? file : fs.readFileSync(file.path),
        caption: waterMark
      };
      media.push(mediaBlock);

      if (!stringArray) {
        fs.unlink(`${file.destination}${file.filename}`, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
            reject(err);
          } else {
            console.log('Файл успешно удален:', file.path);
          }
        });
      }
    }
    
    if (media.length > 10) {
      console.error('Слишком много медиафайлов');
      reject(new Error('Слишком много медиафайлов'));
      return;
    }

    bot.sendMediaGroup(CHAT_ID as string, media)
      .then(() => {
        resolve(true);
      })
      .catch((error: Error) => {
        console.error('Ошибка при отправке сообщения:', error);
        reject(error);
      });
  });
}
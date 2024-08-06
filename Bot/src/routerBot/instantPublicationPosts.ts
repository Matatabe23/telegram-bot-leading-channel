import { bot } from './index.js';
import fs from 'fs';
import { downloadFile } from '../utils/downloadFile.js';
import { waterMark } from '../const/const.js';
import { deleteLocalFile } from '../utils/downloadFile.js';

export async function instantPublicationPosts(files: any, chatId: string, stringArray?: boolean) {
  return new Promise(async (resolve, reject) => {
    const media: any = [];

    for (const file of files) {
      let filePath: any = '';

      if (stringArray) {
        try {
          const result = await downloadFile(file);
          filePath = result;
        } catch (error) {
          console.error('Ошибка при скачивании файла:', error);
          reject(error);
          return;
        }
      } else {
        filePath = file.path;
      }

      const mediaBlock = {
        type: 'photo',
        media: fs.createReadStream(filePath),
        caption: waterMark
      };
      media.push(mediaBlock);
    }

    if (media.length > 10) {
      console.error('Слишком много медиафайлов');
      reject(new Error('Слишком много медиафайлов'));
      return;
    }

    try {
      console.log(chatId)
      await bot.sendMediaGroup(chatId as string, media);
      const deletePromises = files.map(file => deleteLocalFile(stringArray ? file.split('/').pop() : file.path.split('\\').pop()));
      await Promise.all(deletePromises);

      resolve(true);
    } catch (error: any) {
      console.error('Ошибка при отправке сообщения:', error);
      reject(error);
    }
  });
}

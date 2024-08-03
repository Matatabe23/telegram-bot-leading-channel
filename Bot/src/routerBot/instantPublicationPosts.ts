// основной файл (например, index.js или ваш основной модуль)
import { bot } from './index.js';
import fs from 'fs';
import path from 'path';
import { downloadFile } from '../service/downloadFile.js';
import { waterMark } from '../const/const.js';
import { CHAT_ID } from '../const/constENV.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageFolder = path.join(__dirname, '../image');

fs.mkdir(imageFolder, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка при создании папки:', err);
  }
});

export async function instantPublicationPosts(files: any, stringArray?: boolean) {
  return new Promise(async (resolve, reject) => {
    const media: any = [];

    for (const file of files) {
      let filePath = '';

      if (stringArray) {
        const localFilePath = path.join(imageFolder, path.basename(file));
        try {
          await downloadFile(file, localFilePath);
          filePath = localFilePath;
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

      if (!stringArray) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Ошибка при удалении файла:', err);
            reject(err);
          } else {
            console.log('Файл успешно удален:', filePath);
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
        fs.readdir(imageFolder, (err, files) => {
          if (err) {
            console.error('Ошибка при чтении папки:', err);
            reject(err);
            return;
          }

          files.forEach(file => {
            const filePath = path.join(imageFolder, file);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Ошибка при удалении файла:', err);
              } else {
                console.log('Файл успешно удален:', filePath);
              }
            });
          });
        });

        resolve(true);
      })
      .catch((error: Error) => {
        console.error('Ошибка при отправке сообщения:', error);
        reject(error);
      });
  });
}

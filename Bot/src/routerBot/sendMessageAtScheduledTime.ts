import { dataBasePost, imageData } from '../models/models.js';
import { bot } from '../routerBot/index.js';
import { deleteImageFromS3 } from '../service/s3-service.js';
import { CHAT_ID } from '../const/constENV.js';
import { S3_BUCKET_NAME, S3_PATH } from '../const/constENV.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { downloadFile } from '../utils/downloadFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imageFolder = path.join(__dirname, '../image');

fs.mkdir(imageFolder, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка при создании папки:', err);
  }
});

export default async function sendMessageAtScheduledTime() {
  const postWithImages: any = await dataBasePost.findOne({
    order: [['id', 'ASC']],
    include: imageData
  });

  if (!postWithImages) return;

  const media: any = [];

  for (const item of postWithImages.imageData) {
    const localFilePath = path.join(imageFolder, path.basename(item.image));
    try {
      await downloadFile(`${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`);
      media.push({
        type: 'photo',
        media: fs.createReadStream(localFilePath),
        id: item.id,
        caption: '#QugorArts'
      });
    } catch (error) {
      console.error('Ошибка при скачивании файла из S3:', error);
      return;
    }
  }

  const postId = postWithImages.id;

  if (media.length > 10) {
    console.error('Слишком много медиафайлов');
    return;
  }

  if (CHAT_ID) {
    bot.sendMediaGroup(CHAT_ID, media)
      .then(async () => {
        fs.readdir(imageFolder, (err, files) => {
          if (err) {
            console.error('Ошибка при чтении папки:', err);
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

        await Promise.all(
          postWithImages.imageData.map(async (item: any) => {
            await imageData.destroy({ where: { id: item.id } });
            deleteImageFromS3(item.image);
          })
        );
        await dataBasePost.destroy({ where: { id: postId } });
      })
      .catch((error: Error) => {
        console.error('Ошибка при отправке сообщения:', error);
      });
  }
}

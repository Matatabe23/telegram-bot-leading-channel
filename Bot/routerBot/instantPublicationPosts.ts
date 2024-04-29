const { bot } = require('./index')
const fs = require('fs');

export async function instantPublicationPosts(files: any) {
  const media: any = []
  for (const file of files) {
    const mediaBlock = {
      type: 'photo',
      media: fs.readFileSync(file.path),
      caption: '#QugorArts'
    }
    media.push(mediaBlock)

    fs.unlink(`${file.destination}${file.filename}`, (err: any) => {
      if (err) {
        console.error('Ошибка при удалении файла:', err);
      } else {
        console.log('Файл успешно удален:', file.path);
      }
    });
  }

  if (media.lenght > 10) {
    console.error('Слишком много медиафайлов');
    return
  }

  try {
    bot.sendMediaGroup(process.env.CHAT_ID_DEV, media)
      .then(async () => {

      })
      .catch((error: any) => {
        console.error('Ошибка при отправке сообщения:', error);
      });
  } catch (e: any) {
    console.log(e)
  }
}
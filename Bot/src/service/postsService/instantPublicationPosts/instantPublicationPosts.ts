import addWatermark from '../../waterMark-service.js'
import { instantPublicationPosts } from '../../../routerBot/instantPublicationPosts.js'

export async function instantPublicationPost(files: any, waterMark: boolean, chatIdList: string[]) {
  if(chatIdList.length === 0) throw new Error('Нету каналов для публикации');

  if (waterMark === true) {
    for (const file of files) {
      await addWatermark(file)
    }

    for(const chatId of chatIdList){
      await instantPublicationPosts(files, chatId)
    }
    return 'Успешная моментальная публикация'
  }

  for(const chatId of chatIdList){
    await instantPublicationPosts(files, chatId)
  }
  return 'Успешная моментальная публикация'
}
import addWatermark from '../../waterMark-service.js'
import { instantPublicationPosts } from '../../../routerBot/instantPublicationPosts.js'

export async function instantPublicationPost(files: any, waterMark: boolean) {

  if (waterMark === true) {
    for (const file of files) {
      await addWatermark(file)
    }

    await instantPublicationPosts(files)
    return 'Успешная моментальная публикация'
  }

  await instantPublicationPosts(files);
  return 'Успешная моментальная публикация'
}